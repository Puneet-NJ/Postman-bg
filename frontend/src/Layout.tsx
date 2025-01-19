import { Button } from "./components/ui/button";
import { LOGO_URL } from "./lib/urls";

const Layout = ({ children }: { children: React.ReactNode }) => {
	return (
		<main className="w-full">
			<nav className="flex justify-between py-2 bg-gray-300 px-[7%]">
				<div>
					<img src={LOGO_URL} />
				</div>

				<div>
					<Button>Log in</Button>
				</div>
			</nav>

			<div className="px-[7%] py-12">{children}</div>
		</main>
	);
};

export default Layout;
