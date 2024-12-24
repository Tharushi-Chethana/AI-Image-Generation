function PromptInput({ userInput, setUserInput, handleSubmit }) {
    return (
      <div>
        <h4>Prompt Area</h4>
        <form onSubmit={handleSubmit}>
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Enter a description"
          />
          <select>
            <option selected>Open this select menu</option>
            <option value="1">Tea Box</option>
            <option value="2">Wine Box</option>
            <option value="3">Cheese Box</option>
          </select>
          <button type="submit">Generate Image</button>
        </form>
      </div>
    );
  }
  