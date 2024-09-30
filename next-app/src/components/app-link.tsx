import Link from "next/link";

export const AppLink = (props) => {
    return (
        <Link className="underline underline-offset-2 text-primary break-words" {...props} />
    )
}
