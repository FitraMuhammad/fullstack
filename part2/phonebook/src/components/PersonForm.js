const PersonForm = ({handleAdd,handleNameChange,nameValue,handleNumberChange,numberValue}) => {
  return (
    <>
      <form onSubmit={handleAdd}>
        <div>
          name: <input onChange={handleNameChange} value={nameValue} />
        </div>
        <div>
          number: <input onChange={handleNumberChange} value={numberValue} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </>
  );
};

export default PersonForm;
