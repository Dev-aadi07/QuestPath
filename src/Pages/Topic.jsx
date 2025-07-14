import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Card from "../components/Card";

const Topic = () => {
  const { company } = useParams();
  const navigate = useNavigate();

  const [topics, setTopics] = useState([]);
  const [questions, setQuestions] = useState({});

  useEffect(() => {
    const loadData = async () => {
      try {
        const topicsFile = await import(`../data/topics/${company.toLowerCase()}.json`);
        const questionsFile = await import(`../data/questions/${company.toLowerCase()}.json`);
        setTopics(topicsFile.default);
        setQuestions(questionsFile.default);
      } catch (err) {
        setTopics([]);
        setQuestions({});
      }
    };
    loadData();
  }, [company]);

  return (
    <div className="bg-orange-800 flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-white absolute top-20 text-3xl font-bold mb-4 uppercase">{company}</h1>

      <div className="bg-orange-900 w-full h-96 max-w-7xl p-6 rounded-2xl overflow-y-auto scrollbar-none grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3">
        {topics.map(tp => {
          const key = `${company.toLowerCase()}-${tp.toLowerCase().replace(/ /g, "-")}-questionList`;
          const solved = Object.values(JSON.parse(localStorage.getItem(key) || "{}")).filter(Boolean).length;
          const total = questions[tp.toLowerCase()]?.length || 0;

          return (
            <Card
              key={tp}
              title={tp}
              onClick={() => navigate(`/${company}/${tp.toLowerCase().replace(/ /g, "-")}`)}
              solved={solved}
              total={total}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Topic;
