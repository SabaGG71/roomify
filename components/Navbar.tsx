import {Box} from "lucide-react";
import {Button} from "./Button";
import {useOutletContext} from "react-router";

export const Navbar = () => {
    // const isSignedIn = false;
    // const username = "saba";

    const {isSignedIn, username, signIn, signOut} = useOutletContext<AuthContext>()

    const handleAuthClick = async () => {
        if(isSignedIn) {
            try {
                await signOut();
            } catch(err) {
                console.log(`Puter Sign Out Error: ${err}`);
            }
            return;
        }
        try {
            await signIn();
        }
        catch(err) {
            console.log(`Puter Sign In Error: ${err}`);
        }
    }

    return (
    <header className="navbar">
        <nav className="inner">
            <div className="left">
                <div className="brand">
                    <Box className="logo" />
                    <span className="name">
                        Roomify
                    </span>
                </div>

                <ul className="links">
                    <a href="#">Product</a>
                    <a href="#">Pricing</a>
                    <a href="#">Community</a>
                    <a href="#">Enterprise</a>
                </ul>
            </div>

            <div className="actions">
                {isSignedIn ? ( <>
                    <span className="greeting">
                        {username ? `Hi, ${username}` : "Signed In"}
                    </span>
                    <Button size="sm" onClick={handleAuthClick} className="btn">Log Out</Button>
                </>) : (
                    <>
                        <Button size="sm" variant="ghost"  onClick={handleAuthClick}>Log In</Button>
                        <a href="#upload" className="cta">Get Started</a>
                    </>
                )}
            </div>
        </nav>
    </header>
    )
}