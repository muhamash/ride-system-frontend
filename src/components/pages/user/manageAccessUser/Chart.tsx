 
import
    {
        Card,
        CardContent,
        CardDescription,
        CardHeader,
        CardTitle,
    } from "@/components/ui/card";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

export default function ChartShow ( { chartData }: never )
{
    const COLORS = [ '#ef4444', '#3b82f6', '#10b981' ];
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>User Distribution</CardTitle>
                <CardDescription>
                    Breakdown of users by role
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                label={( { name, percent } ) => `${ name }: ${ ( percent * 100 ).toFixed( 0 ) }%`}
                            >
                                {chartData.map( ( entry, index ) => (
                                    <Cell key={`cell-${ index }`} fill={COLORS[ index % COLORS.length ]} />
                                ) )}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                
                <div className="mt-4 space-y-2">
                    {chartData.map( ( item, index ) => (
                        <div key={item.name} className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div
                                    className="w-3 h-3 rounded-full mr-2"
                                    style={{ backgroundColor: COLORS[ index ] }}
                                ></div>
                                <span className="text-sm">{item.name}</span>
                            </div>
                            <span className="text-sm font-medium">{item.value}</span>
                        </div>
                    ) )}
                </div>
            </CardContent>
        </Card>
    );
}
