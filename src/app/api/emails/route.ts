import CommentNotification from "@/emails/CommentNotification";
import InquirySubmission from "@/emails/InquirySubmission";
import Welcome from "@/emails/Welcome";
import { Resend } from "resend"


const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
   
    const {email, name, action, content, dogName} = await request.json()
    

  let emailTemplate;
  let subject;

     if (action === "signup") {
      emailTemplate = Welcome({ name });
      subject = "Welcome!";
    } else if (action === "comment") {
      emailTemplate = CommentNotification({ name, content });
      subject = "New Comment on Your Post!";
    } else if (action === "inquirySubmission") {
      emailTemplate = InquirySubmission({name, dogName})
    } else {
      return new Response("Invalid action", { status: 400 });
    }


const data = await resend.emails.send({
  from: 'onboarding@resend.dev',
  to: email,
  subject: action,
  react: emailTemplate,
});

return Response.json({success:true, data})
  } catch (error) {
    console.log(error)
  }
  
}


