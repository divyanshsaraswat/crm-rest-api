const accountService = require("../services/accountService");
exports.getAccounts = async (req, res) => {
  try {
    const { pid, role } = req;
    const data = { pid, role };
    const accounts = await accountService.getAccounts(data);
    res.status(200).json({ message: accounts });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error out" });
  }
};
exports.updateById = async (req,res)=>{
  try {
    const {id,first_name,last_name,email,phone,account_id} = req.body
    const result = await accountService.updateById({id,first_name,last_name,email,phone,account_id});
    res.status(200).json({"message":"Contact Updated."})
  } catch (error) {
    res.status(500).json({error:"Internal Server Error"})
  }
}
exports.getAccountLists = async (req, res) => {
  try {
    const { pid, role } = req;
    const account = await accountService.getAccountsList();
    res.status(200).json({ message: account });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error in" });
  }
};
exports.getidDetails = async (req,res)=>{
  try {
    const result = await accountService.getidDetails();
    res.status(200).json({message:result})
  } catch (error) {
    res.status(500).json({error:"Internal Server Error"})
  }
}
exports.getAccountById = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req;
    if (!id) {
      return res.status(400).json({ error: "Account ID is required" });
    }
    const account = await accountService.getAccountById(id);
    if (!account) {
      return res.status(404).json({ error: "Account not found" });
    }
    res.status(200).json({ message: account });
  } catch (error) {
    console.error("Error fetching account:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.insertAccount = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      waphone,
      BusinessNature,
      Address1,
      City,
      State,
      Country,
      Zip,
      assigned_user_id,
      SourceID,
      DesignationID,
      StatusID,
    } = req.body;
    const { pid, role } = req;

    if (!name) {
      return res.status(400).json({ error: "Account name is required" });
    }

    const result = await accountService.insertAccount({
      name,
      email,
      phone,
      waphone,
      BusinessNature,
      Address1,
      City,
      State,
      Country,
      Zip,
      assigned_user_id,
      SourceID,
      DesignationID,
      StatusID,
      pid
    });

    res.status(201).json({ message: "Account inserted successfully" });
  } catch (error) {
    console.error("Error inserting account:", error);
    res.status(500).json({ error: "Internal Server Error outer" });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req;

    if (!id) {
      return res.status(400).json({ error: "Account ID is required" });
    }

    const result = await accountService.deleteAccount(id);

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Error deleting account:", error);
    res.status(500).json({ error: "Internal Server Error outer" });
  }
};
exports.downloadCSV = async (req, res) => {
  try {
    const { records } = req.body;

    // console.log(records);

    const result = await accountService.downloadCSV(records);
    res
      .status(200)
      .set({
        "Content-Type": "text/csv",
        "Content-Disposition": 'attachment; filename="users.csv"',
      })
      .send(result);
  } catch (error) {
    console.error("Error downloading CSV:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Example data object matching the schema
