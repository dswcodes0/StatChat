import { GAME_NAMES } from "../Data/GameNames";

/**
 * props = { propA: 1, propB: 'foo' }
 */
function StatsForm(props) {
  const handleSubmit = props.handleSubmit;
  const onGamertagChange = props.onGamertagChange;
  const formData = props.formData;
  const onPlatformChange = props.onPlatformChange;
  const onGameNameChange = props.onGameNameChange;

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          onChange={onGamertagChange}
          type="text"
          name="gamertag"
          placeholder="Username"
          className="input-field"
          value={formData.gamertag}
        />
        <select
          onChange={onPlatformChange}
          name="platform"
          className="input-field"
          value={formData.platform}
        >
          <option value="">Select Platform</option>
          <option value="Xbox">Xbox</option>
          <option value="PC">PC</option>
          <option value="PS4">PlayStation</option>
        </select>
        <select
          onChange={onGameNameChange}
          name="gameName"
          className="input-field"
          value={formData.gameName}
        >
          <option value={GAME_NAMES.APEX}>Apex Legends</option>
          <option value={GAME_NAMES.R6}>Rainbow Six Siege</option>
        </select>
        <input type="submit" value="Submit" className="submit-btn" />
      </form>
    </div>
  );
}

export default StatsForm;
