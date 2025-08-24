import { useAllDriverDataQuery, useAllRideDataQuery, useAllUserDataQuery } from "@/redux/features/api/admin.api";

export default function UpdateUserPage ()
{
  const { data: allDrivers } = useAllDriverDataQuery();
  const { data: allUser } = useAllUserDataQuery();
  const { data: allRides } = useAllRideDataQuery();

  console.log(allDrivers, allRides, allUser)

  return (
    <div>
      UpdateUserPage
    </div>
  )
}
