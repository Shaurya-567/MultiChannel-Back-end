const {User} = require("../model/User");
const crypto = require("crypto");
const {sendMail} = require("../mail/Mail")
const {mailHTMLTemplate,mailSubject,mailText} = require("../mail/Mailtemplate");
exports.resetPasswordLink=async(user)=>{
        
        try{
            const {email} = user;
            const dbUser =await User.findOne({email});
            if(!dbUser){
                return false;
            }
            const token =crypto.randomBytes(48).toString('hex');
            dbUser.resetPasswordToken=token;
            await dbUser.save();
            let link =`http://localhost:3000/app/reset-password?token=${token}&email=${email}`;
        return link
        }
        catch(e){
            return false;
        }
}
exports.resetPassword=async(user)=>{
    return new Promise(async(resolve, reject)=>{
        try{
            const {email,password,token} = user;
            const dbUser =await User.findOne({email,resetPasswordToken:token});
            if(!dbUser){
                return reject({success:false,message:"User not found or Token is invalid"});
            }
            let salt = await crypto.randomBytes(16);
            crypto.pbkdf2(
                password,
                salt,
                310000,
                32,
                "sha256",
                async function (err, hashedPassword) {
                    if(err) return reject({success:false,message:"token expire or not valid"}); 
                    dbUser.password=hashedPassword;
                    dbUser.salt=salt;
                    dbUser.token="";
                    await dbUser.save();
                    const resetLink =`http://localhost:3000/app/login`;
                    const prepareMailData={
                        to:email,
                        subject:mailSubject('resetPassword'),
                        html:mailHTMLTemplate('resetPassword',resetLink),
                        text:mailText('resetPassword')
                      }
                      const responseMail = await sendMail(prepareMailData);
                      return resolve({success:true,message:"Password reset successfully"});
                })
        }
        catch(er){
            console.log("reset password",er);
            return reject({success:false,message:"Database connection error",er:er});
        }
    })
    
    
};