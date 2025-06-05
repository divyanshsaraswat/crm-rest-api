const accountService = require("../services/accountService");
const userService = require("../services/userService");
const { sendMail } = require("../services/userService");
exports.getAccounts = async (req, res) => {
  try {
    const { pid, role,tenantid } = req;
    const data = { pid, role,tenantid };
    const accounts = await accountService.getAccounts(data);
    const log = await userService.addLogs({pid,tenantid,action:"Showed Accounts list",role})
    res.status(200).json({ message: accounts });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error out" });
  }
};
exports.updateById = async (req,res)=>{
  try {
    const {pid,role} = req;
    const {
    id,
    name,
    industry,
    website,
    Zone,
    Rating,
    ContPerson,
    Address1,
    Address2,
    City,
    Zip,
    State,
    Country,
    phone,
    waphone,
    email,
    BusinessNature,
    SourceID,
    DesignationID,
    StatusID,
  } = req.body
    const result = await accountService.updateById({
    id,
    name,
    industry,
    website,
    pid,
    Zone,
    Rating,
    ContPerson,
    Address1,
    Address2,
    City,
    Zip,
    State,
    Country,
    phone,
    waphone,
    email,
    BusinessNature,
    SourceID,
    DesignationID,
    StatusID,
  });
    const log = await userService.addLogs({pid,tenantid,action:"Updated Account.",role});
    res.status(200).json({"message":"Contact Updated."})
  } catch (error) {
    res.status(500).json({error:"Internal Server Error"})
  }
}
exports.getAccountLists = async (req, res) => {
  try {
    const { pid, role,tenantid } = req;
    const account = await accountService.getAccountsList(tenantid);
    const log = await userService.addLogs({pid,tenantid,action:"Showed Accounts list",role})
    res.status(200).json({ message: account });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error in" });
  }
};
exports.getidDetails = async (req,res)=>{
  try {
    const { pid, role,tenantid } = req;
    const result = await accountService.getidDetails({tenantid});
    const log = await userService.addLogs({pid,tenantid,action:"Showed ID details",role})
    res.status(200).json({message:result})
  } catch (error) {
    res.status(500).json({error:"Internal Server Error"})
  }
}
exports.getAccountById = async (req, res) => {
  try {
    const { id } = req.params;
    const { role,tenantid } = req;
    if (!id) {
      return res.status(400).json({ error: "Account ID is required" });
    }
    const account = await accountService.getAccountById({id,tenantid});
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
      industry,
      website,
      status_type,
      source_type,
      updated_at,
      CustomerName,
      Zone,
      Rating,
      ContPerson,
      Address1,
      Address2,
      City,
      Zip,
      State,
      Country,
      phone,
      waphone,
      email,
      designation_name,
      BusinessNature,
      JoiningDate,
      SourceID,
      DesignationID,
      StatusID,
    } = req.body;
    const { pid, role,tenantid } = req;

    if (!name) {
      return res.status(400).json({ error: "Account name is required" });
    }

    const result = await accountService.insertAccount({
      name,
      industry,
      website,
      status_type,
      source_type,
      pid,
      updated_at,
      CustomerName,
      Zone,
      Rating,
      ContPerson,
      Address1,
      Address2,
      City,
      Zip,
      State,
      Country,
      phone,
      waphone,
      email,
      tenantid,
      designation_name,
      BusinessNature,
      JoiningDate,
      SourceID,
      DesignationID,
      StatusID,
    });
    const mailresult = await sendMail({sender:email});
    if (mailresult){
    const log = await userService.addLogs({pid,tenantid,action:"Added New Account",role})
      res.status(201).json({ message: "Account inserted successfully" });
    }
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


    const log = await userService.addLogs({pid, tenantid, action: "Deleted Account", role})
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
    const { pid, tenantid, role } = req;
    const log = await userService.addLogs({pid, tenantid, action: "Downloaded CSV file", role});
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
