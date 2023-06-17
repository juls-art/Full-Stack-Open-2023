import { useState } from 'react'

const Button = ({ text, handleClick }) => {
	return <button onClick={handleClick}>{text}</button>
}

const StatisticLine = (props) => {
  return (
    <div>{props.text} {props.value}</div>
  )
}

const Statistics = (props) => {
  if (props.total === 0) {
    return <div>No feedback given</div>
  }
  return (
    <div>
      <table>
        <tbody>
          <tr>
            <td><StatisticLine value={props.good} text='good'/></td>
          </tr>
          <tr>
            <td><StatisticLine value={props.neutral} text='neutral'/></td>
          </tr>
          <tr>
            <td><StatisticLine value={props.bad} text='bad'/></td>
          </tr>
          <tr>
            <td><StatisticLine value={props.total} text='all'/></td>
          </tr>
          <tr>
            <td><StatisticLine value={((props.good - props.bad) / props.total)} text='average'/></td>
          </tr>
          <tr>
            <td><StatisticLine value={((props.good / props.total) * 100 + '%')} text='positive'/></td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}


const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [total, setTotal] = useState(0)

  const handleGoodClick = () => {
    const updatedGood = good + 1
    setGood(updatedGood)
    setTotal(updatedGood + neutral + bad) 
  }
  const handleNeutralClick = () => {
    const updatedNeutral = neutral + 1
    setNeutral(updatedNeutral)
    setTotal(good + updatedNeutral + bad)
  }
  const handleBadClick = () => {
    const updatedBad = bad + 1
    setBad(updatedBad)
    setTotal(good + neutral + updatedBad)
  }
  
  return (
    <div>
      <h1>give feedback</h1>
      <Button text="good" handleClick={handleGoodClick} />
      <Button text="neutral" handleClick={handleNeutralClick} />
      <Button text="bad" handleClick={handleBadClick} />

      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} total={total} />
    </div>
  )
}

export default App