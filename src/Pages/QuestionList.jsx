import { useParams } from "react-router-dom";
import { useEffect, useState, memo } from "react";

const QuestionItem = memo(({ item, idx, checked, onCheck }) => (
  <li
    className={`bg-zinc-900 p-4 rounded flex gap-2 items-start transition-all duration-300 ${
      checked ? "opacity-50" : "opacity-100"
    }`}
  >
    <input
      type="checkbox"
      id={`q-${idx}`}
      checked={checked}
      onChange={() => onCheck(idx)}
      className="mt-1"
    />
    <a
      href={item.url || "#"}
      target="_blank"
      rel="noopener noreferrer"
      className="block hover:underline text-white"
    >
      {item.title}
    </a>
  </li>
));

const QuestionList = () => {
  const { company, topicName } = useParams();
  const [questions, setQuestions] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  const [delayedChecked, setDelayedChecked] = useState({});
  const [loading, setLoading] = useState(true);

  const normalizedTopic = topicName?.toLowerCase().replace(/ /g, "-");
  const topicKey = `${company.toLowerCase()}-${normalizedTopic}-questionList`;

useEffect(() => {
  const loadQuestions = async () => {
    try {
      const file = await import(`../data/questions/${company.toLowerCase()}.json`);
      const allQuestions = file.default;

      const topicEntry = Object.entries(allQuestions).find(
        ([key]) => key.toLowerCase().replace(/ /g, "-") === normalizedTopic
      );

      const topicQuestions = topicEntry ? topicEntry[1] : [];
      setQuestions(topicQuestions);

      const saved = localStorage.getItem(topicKey);
      const parsed = saved ? JSON.parse(saved) : {};
      setCheckedItems(parsed);
      setDelayedChecked(parsed); // 🛠️ Fix here

    } catch (err) {
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };
    loadQuestions();
  }, [company, topicName, topicKey, normalizedTopic]);


  const handleCheck = (idx) => {
    // Step 1: Update immediate visual state
    setCheckedItems((prev) => {
      const updated = { ...prev, [idx]: !prev[idx] };
      localStorage.setItem(topicKey, JSON.stringify(updated));
      return updated;
    });

    // Step 2: Delay sorting movement
    setTimeout(() => {
      setDelayedChecked((prev) => ({
        ...prev,
        [idx]: !prev[idx],
      }));
    }, 200); // Delay before reordering
  };

  const solvedCount = Object.values(checkedItems).filter(Boolean).length;

  const sortedQuestions = [...questions]
    .map((item, idx) => ({ ...item, originalIndex: idx }))
    .sort((a, b) => {
      const aChecked = delayedChecked[a.originalIndex] || false;
      const bChecked = delayedChecked[b.originalIndex] || false;
      return aChecked - bChecked;
    });

  return (
    <div className="p-6 flex flex-col items-center justify-center text-zinc-300 bg-orange-800 min-h-screen">
      <h1 className="text-zinc-900 text-3xl font-bold mb-4 uppercase">
        {company} - {topicName}
      </h1>

      {loading ? (
        <p>Loading...</p>
      ) : questions.length === 0 ? (
        <p>No questions found for this topic.</p>
      ) : (
        <div className="h-[26rem] rounded-xl bg-orange-900 p-4 pl-9 pb-12 w-5/6 sm:w-2/4 relative overflow-hidden">
          <p className="absolute top-2 left-4 text-sm text-white/80 font-medium">
            Solved: {solvedCount} / {questions.length}
          </p>
          <div className="mt-6 h-full overflow-y-auto pr-2 custom-scrollbar">
            <ul className="space-y-2">
              {sortedQuestions.map((item) => (
                <QuestionItem
                  key={item.originalIndex}
                  item={item}
                  idx={item.originalIndex}
                  checked={checkedItems[item.originalIndex] || false}
                  onCheck={handleCheck}
                />
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionList;
