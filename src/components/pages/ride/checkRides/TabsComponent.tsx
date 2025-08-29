import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ITabs
{
    tab: string;
    handleTabChange: () => void;
}

export default function TabsComponent({tab, handleTabChange}: ITabs) {
    return (
        <div className="py-4 w-fit mx-auto">
            <Tabs value={tab} onValueChange={handleTabChange}>
                <TabsList className="grid grid-cols-2 w-full max-w-xs">
                    <TabsTrigger value="my">Your rides</TabsTrigger>
                    <TabsTrigger value="all">All rides</TabsTrigger>
                </TabsList>
            </Tabs>
        </div>
    );
}