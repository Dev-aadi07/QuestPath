import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Card from "../components/Card";
import companies from "../data/companies.json";

const Home = () => {
  const navigate = useNavigate();
  const [companyStats, setCompanyStats] = useState({});

  useEffect(() => {
    const loadStats = async () => {
      const stats = {};

      for (const company of companies) {
        try {
          const topicsFile = await import(`../data/topics/${company.toLowerCase()}.json`);
          const questionsFile = await import(`../data/questions/${company.toLowerCase()}.json`);
          const topicList = topicsFile.default;
          const questionSet = questionsFile.default;

          let solved = 0;
          let total = 0;

          topicList.forEach(tp => {
            const key = `${company.toLowerCase()}-${tp.toLowerCase().replace(/ /g, "-")}-questionList`;
            const checked = JSON.parse(localStorage.getItem(key) || "{}");
            solved += Object.values(checked).filter(Boolean).length;

            total += questionSet[tp.toLowerCase()]?.length || 0;
          });

          stats[company] = { solved, total };
        } catch (err) {
          stats[company] = { solved: 0, total: 0 };
        }
      }

      setCompanyStats(stats);
    };

    loadStats();
  }, []);

  return (
    <div className="bg-orange-800 flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-white absolute top-20 text-3xl font-bold mb-4 uppercase">QuestPath</h1>
      <div className="bg-orange-900 w-full h-96 max-w-7xl p-6 rounded-2xl overflow-y-auto scrollbar-none grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3">
        {companies.map(company => (
          <Card
            key={company}
            title={company}
            onClick={() => navigate(`/${company.toLowerCase()}`)}
            solved={companyStats[company]?.solved || 0}
            total={companyStats[company]?.total || 0}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
