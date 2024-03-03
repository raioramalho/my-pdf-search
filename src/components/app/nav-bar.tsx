import { ThemeToggle } from "../ui-theme/theme-toggle";

export default function NavBar() {

    return (
      <div
        id="navbar"
        className="p-2 mr-4 ml-4 mt-4 flex flex-row justify-between items-center border rounded-md"
      >
        <div className="flex flex-row">
          <h2>MyPdfSearch</h2>
        </div>
        <ThemeToggle />
      </div>
    );
  }