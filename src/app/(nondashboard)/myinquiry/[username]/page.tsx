import { getRequest, getRequestByUserName } from "@/actions/service.action";
import { getDbUserId, getUser } from "@/actions/user.action";
import InquiryCard from "@/components/Inquiry/InquiryCard";

async function page({ params }: { params: { username: string } }) {
  const { username } = params;
  const inquiries = await getRequestByUserName(username);
  const dbUserId = await getDbUserId();
  const user = await getUser();

  // Check if the current user is authorized to view this page
  // Only allow if the username in the route matches the logged-in user's username
  // or if the logged-in user is a manager
  const isAuthorized =
    user?.username === username || (user && user.userRole === "manager");

  return (
    <div>
      <InquiryCard
        inquiry={inquiries}
        dbUserId={dbUserId}
        user={user}
        isAuthorized={isAuthorized}
        routeUsername={username}
      />
    </div>
  );
}

export default page;
