const ADMIN_CREATE = `
INSERT INTO admin_create
 (id, admin_id, profile_pic, user_name, password, company_name, com_logo, designation, email_id, mobile_no, doc_upload, subs_from, subs_to, status, role_id, role_name, createdtime, createdby, short_name)
  VALUES
(?, ?, ?, ?, ?, ?, ?,?,?,?,?,?,?,?,?,?,?,?,?);

  `
module.exports.ADMIN_CREATE = ADMIN_CREATE