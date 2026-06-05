import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger
} from "@/components/ui/collapsible";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Logout from "../components/molecules/auth/Logout";
import useCheckActiveNav from "../hooks/useCheckActiveNav";

export default function Nav({ links, isCollapsed, className, closeNav, checkingUser, handleNavigating, fromMobile = false }) {

    const renderLink = ({ sub, ...rest }) => {
        const key = `${rest.title}-${rest.href}`;

        if (isCollapsed && sub)
            return (
                <NavLinkIconDropdown
                    {...rest}
                    sub={sub}
                    key={key}
                    closeNav={closeNav}
                />
            )

        if (isCollapsed)
            return <NavLinkIcon {...rest} key={key} closeNav={closeNav} />

        if (sub)
            return (
                <NavLinkDropdown {...rest} sub={sub} key={key} closeNav={closeNav} />
            )

        return <NavLink {...rest} key={key} closeNav={closeNav} />
    }

    const homePageUrl = import.meta.env.VITE_HOME_PAGE_URL;

    let mobileNav;

    if (fromMobile && !checkingUser) {
        mobileNav = (
            <>
                <NavLink title={"Login"} href={"/login"} className="justify-center mt-2 text-gray-100 bg-gray-800" />
            </>
        )
    }

    const auth = useSelector(state => state.auth);
    
    if (fromMobile && checkingUser) {
        mobileNav = (
            <div className="flex flex-col">
                <div className="flex items-center gap-4 px-8 py-4">
                    <Button variant='ghost' className='relative w-10 h-10 rounded-full'>
                        <Avatar className='w-8 h-8'>
                            <AvatarImage src='/avatars/01.png' alt='@shadcn' />
                            <AvatarFallback>
                                {
                                    ( auth?.student?.profile_image) ? (
                                        <img src={auth?.student?.profile_image} alt="user image" />
                                    ) : (
                                        <span>{auth?.student?.name.charAt(0)}</span>
                                    )
                                }
                            </AvatarFallback>
                        </Avatar>
                    </Button>
                    <div className="flex flex-col gap-2">
                        <p className='leading-none text-muted-foreground'>
                            {auth?.student?.name}
                        </p>
                        <p className='text-sm leading-none text-muted-foreground'>
                            {auth?.student?.email}
                        </p>
                    </div>
                </div>

                <NavLink
                    title={"Profile"}
                    href="/profile"
                />

                <NavLink
                    title={"Exam history"}
                    href="/exam-history"
                />

                <div>
                    <Logout />
                </div>
            </div>
        )
    }

    return (
        <div
            data-collapsed={isCollapsed}
            className={cn(
                "group border-b bg-background py-2 transition-[max-height,padding] duration-500 data-[collapsed=true]:py-2 md:border-none",
                className
            )}
        >
            <TooltipProvider delayDuration={0}>
                <nav className="flex w-full mx-2 flex-col md:flex-row gap-1 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
                    {links.map(renderLink)}

                    <div className="border-t-[1px] mb-2" />

                    {mobileNav}
                </nav>
            </TooltipProvider>
        </div>
    )
}

function NavLink({ title, label, href, closeNav, subLink = false, className }) {
    const { checkActiveNav } = useCheckActiveNav();

    return (
        <Link
            to={href}
            onClick={closeNav}
            className={cn(
                buttonVariants({
                    variant: checkActiveNav(href) ? "secondary" : "ghost",
                    size: "sm"
                }),
                `h-12 flex justify-start ${checkActiveNav(href) ? 'lg:actives' : "lg:list"} text-base lg:!bg-transparent mx-8 hover-effect text-wrap ${className}`,
                subLink && "h-10 w-full border-l border-l-slate-500 px-2"
            )}
            aria-current={checkActiveNav(href) ? "page" : undefined}
        >
            <div className="mr-2">
            </div>
            {title}
            {label && (
                <div className="ml-2 rounded-lg bg-primary px-1 text-[0.625rem] text-primary-foreground">
                    {label}
                </div>
            )}
        </Link>
    )
}

function NavLinkDropdown({ title, label, sub, closeNav }) {
    const { checkActiveNav } = useCheckActiveNav();

    /* Open collapsible by default
     * if one of child element is active */
    const isChildActive = !!sub?.find(s => checkActiveNav(s.href));

    return (
        <Collapsible defaultOpen={isChildActive}>
            <CollapsibleTrigger
                className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                    "group h-12 w-full justify-start rounded-none px-6"
                )}
            >
                <div className="mr-2">
                    
                </div>
                {title}
                {label && (
                    <div className="ml-2 rounded-lg bg-primary px-1 text-[0.625rem] text-primary-foreground">
                        {label}
                    </div>
                )}
                <span
                    className={cn(
                        'ml-auto transition-all group-data-[state="open"]:-rotate-180'
                    )}
                >
                    <ChevronDown />
                </span>
            </CollapsibleTrigger>
            <CollapsibleContent className="collapsibleDropdown" asChild>
                <ul>
                    {
                        sub.map(sublink => (
                            <li key={sublink.title} className="my-1 ml-8">
                                <NavLink {...sublink} subLink closeNav={closeNav} />
                            </li>
                        ))
                    }
                </ul>
            </CollapsibleContent>
        </Collapsible>
    )
}

function NavLinkIcon({ title,  label, href }) {
    const { checkActiveNav } = useCheckActiveNav();

    return (
        <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
                <Link
                    to={href}
                    className={cn(
                        buttonVariants({
                            variant: checkActiveNav(href) ? "secondary" : "ghost",
                            size: "icon"
                        }),
                        "h-12 w-12"
                    )}
                >
                    <span className="sr-only">{title}</span>
                </Link>
            </TooltipTrigger>
            <TooltipContent side="right" className="flex items-center gap-4">
                {title}
                {label && (
                    <span className="ml-auto text-muted-foreground">{label}</span>
                )}
            </TooltipContent>
        </Tooltip>
    )
}

function NavLinkIconDropdown({ title, label, sub }) {
    const { checkActiveNav } = useCheckActiveNav();

    /* Open collapsible by default
     * if one of child element is active */
    const isChildActive = !!sub?.find(s => checkActiveNav(s.href));

    return (
        <DropdownMenu>
            <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant={isChildActive ? "secondary" : "ghost"}
                            size="icon"
                            className="w-12 h-12"
                        >
                        </Button>
                    </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent side="right" className="flex items-center gap-4">
                    {title}{" "}
                    {label && (
                        <span className="ml-auto text-muted-foreground">{label}</span>
                    )}
                    <ChevronDown />
                    {/* <IconChevronDown
                        size={18}
                        className="-rotate-90 text-muted-foreground"
                    /> */}
                </TooltipContent>
            </Tooltip>
            <DropdownMenuContent side="right" align="start" sideOffset={4}>
                <DropdownMenuLabel>
                    {title} {label ? `(${label})` : ""}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {
                    sub.map(({ title, label, href }) => (
                        <DropdownMenuItem key={`${title}-${href}`} asChild>
                            <Link
                                to={href}
                                className={`${checkActiveNav(href) ? "bg-secondary" : ""}`}
                            >
                                <span className="ml-2 max-w-52 text-wrap">{title}</span>
                                {label && <span className="ml-auto text-xs">{label}</span>}
                            </Link>
                        </DropdownMenuItem>
                    ))
                }
            </DropdownMenuContent>
        </DropdownMenu>
    )
}