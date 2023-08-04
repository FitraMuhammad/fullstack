import { useState } from "react";

const Header = ({ title }) => <h1>{title}</h1>;

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>{text}</button>
);

const StatisticLine = ({ text, value }) => (
  <td>
    {text} {value}
  </td>
);

const Statistics = ({ feedback }) => {
  const all = feedback.good + feedback.neutral + feedback.bad;

  if (all === 0) {
    return <p>No feedback given</p>;
  }

  return (
    <table>
      <tbody>
        <tr>
          <StatisticLine text="good" value={feedback.good} />
        </tr>
        <tr>
          <StatisticLine text="neutral" value={feedback.neutral} />
        </tr>
        <tr>
          <StatisticLine text="bad" value={feedback.bad} />
        </tr>
        <tr>
          <StatisticLine text="all" value={all} />
        </tr>
        <tr>
          <StatisticLine
            text="average"
            value={(feedback.good - feedback.bad) / all}
          />
        </tr>
        <tr>
          <StatisticLine
            text="positive"
            value={(feedback.good / all) * 100 + " %"}
          />
        </tr>
      </tbody>
    </table>
  );
};

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const feedback = {
    good: good,
    neutral: neutral,
    bad: bad,
  };

  const handleGoodClick = () => setGood(good + 1);
  const handleNeutralClick = () => setNeutral(neutral + 1);
  const handleBadClick = () => setBad(bad + 1);

  return (
    <>
      <Header title="give feedback" />
      <Button handleClick={handleGoodClick} text="good" />
      <Button handleClick={handleNeutralClick} text="neutral" />
      <Button handleClick={handleBadClick} text="bad" />
      <Header title="statistics" />
      <Statistics feedback={feedback} />
    </>
  );
};

export default App;
