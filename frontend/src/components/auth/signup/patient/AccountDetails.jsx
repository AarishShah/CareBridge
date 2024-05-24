function AccountDetails({ email, password, updateField }) {
  return (
    <>
      <label>Email</label>
      <input
        type="email"
        value={email}
        onChange={(e) => updateField({ email: e.target.value })}
        autoFocus
        required
      />
      <label>Password</label>
      <input
        type="password"
        value={password}
        onChange={(e) => updateField({ password: e.target.value })}
        required
      />
    </>
  );
}

export default AccountDetails;
