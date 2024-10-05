import Link from "next/link";

export const AppLink = (props) => {
    return (
        <Link className="underline underline-offset-4 font-medium break-words" {...props} />
    )
}
