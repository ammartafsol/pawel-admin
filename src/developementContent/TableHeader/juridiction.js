import Status from "@/components/atoms/Status/Status";

export const jurisdictionTableHeader = [
  {
    title: "Name",
    key: "name",
    style: { width: "20%" },
  },
  {
    title: "Description",
    key: "description",
    style: { width: "20%" },
  },
  {
    title: "Status",
    key: "status",
    renderItem: ({ item, data }) => {
      return <Status label={item} variant={data.statusVariant} />;
    },
    style: { width: "20%" },
  },
  {
    title: "Actions",
    key: "viewDetails",
    style: { width: "15%" },
  }
];