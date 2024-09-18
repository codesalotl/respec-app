import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonResults() {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <div className="w-full md:w-1/2">
          <Card className="min-h-[29.4rem]">
            <CardHeader>
              <CardTitle>Ratio View</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-[15rem]">
                <div className="space-y-2">
                  <Skeleton className="h-[2rem] w-[16rem]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
                <div>
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
              <Skeleton className="h-[125px] w-[250px] rounded-xl" />
            </CardContent>
          </Card>
        </div>

        <div className="w-full md:w-1/2 min-h-[300px]">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Summary View</CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[125px] w-[250px] rounded-xl" />
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Timestamp Result</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[125px] w-[250px] rounded-xl" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Table View</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[125px] w-[250px] rounded-xl" />
        </CardContent>
      </Card>
    </div>
  );
}
