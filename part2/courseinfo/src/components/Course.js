const Header = ({name}) => {
    
    return (
      <>
        <h1>{name}</h1>
      </>
    )
  }
  
  const Part = ({name, exercises}) => {
  
    return (
      <>
        <p>{name} {exercises}</p>
      </>
    )
  }
  
  const Content = ({parts}) => {
    
    return (
      <>
        {parts.map(part => <Part key={part.id} name={part.name} exercises={part.exercises}/>)}
      </>
    )
  }
  
  const Total = ({sum}) => {
    
    const totalExercises = sum.reduce((total, exercise) => total + exercise.exercises, 0)

    return (
      <>
        <h4>Total of exercises {totalExercises}</h4>
      </>
    )
  }

  
const Course = ({course}) => {

    return (
        <>
            <Header name={course.name}/>
            <Content parts={course.parts}/>
            <Total sum={course.parts}/>
        </>
    )
}


export default Course