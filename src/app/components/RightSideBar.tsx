import Profile from "./Profile";
import TransactionsServer from "./TransactionsServer";
export default function RightSideBar() {
    return (
        <div>
            <div className="md:col-span-1">
        <Profile />
        </div>
        <div className="mt-6">
        <TransactionsServer />
        </div>
        </div>

    );
}