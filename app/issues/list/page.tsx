import Pagination from "@/app/components/Pagination";
import prisma from "@/prisma/client";
import { Issue, Status } from "@prisma/client";
import { Flex } from "@radix-ui/themes";
import IssueActions from "./IssueActions";
import IssueTable, { IssueQuery, columnNames } from "./IssueTable";
import { Metadata } from "next";

interface Props {
  searchParams: IssueQuery;
}

const IssuePage = async ({ searchParams }: Props) => {
  const statuses = Object.values(Status);
  const status = statuses.includes(searchParams.status)
    ? searchParams.status
    : undefined;

  const where = { status };
  const orderBy = columnNames.includes(searchParams.orderBy)
    ? { [searchParams.orderBy]: "asc" }
    : undefined;

  const page = parseInt(searchParams.page, 10) || 1;
  const pageSize = 10;

  const issues = await prisma.issue.findMany({
    where,
    orderBy,
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  const issueCount = await prisma.issue.count({ where });
  return (
    <Flex direction="column" gap="3">
      <IssueActions />
      <IssueTable searchParams={searchParams} issues={issues} />
      <Pagination
        itemCount={issueCount}
        pageSize={pageSize}
        currentPage={page}
      />
    </Flex>
  );
};

export const dynamic = "force-dynamic";
// export const revalidate = 60;
export default IssuePage;
export const metadata: Metadata = {
  title: "Issue Tracker - Issue List",
  description: "View all project issues",
};
