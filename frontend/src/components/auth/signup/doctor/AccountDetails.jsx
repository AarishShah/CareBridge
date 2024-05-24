function AccountDetails({ email, password, updateField }) {
  return (
    <div className="flex flex-col items-center mt-16 mb-12 w-full">
      <h1 className="text-xl font-bold mb-12 mr-72">Account Details</h1>

      <div  className="w-2/3 mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
      <input
        type="email"
        value={email}
        onChange={(e) => updateField({ email: e.target.value })}
        autoFocus
        // required
        className=" border-gray-600 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        placeholder="Your email..."
      />
      </div>
      
      <div  className="w-2/3 mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
      <input
        type="password"
        value={password}
        onChange={(e) => updateField({ password: e.target.value })}
        // required
        className=" border-gray-600 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        placeholder="Your password..."
      />
      </div>
     
    </div>
  );
}

export default AccountDetails;
