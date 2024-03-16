import prisma from "@/prisma/client";
import { Box, Grid } from "@radix-ui/themes";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import EditIssueButton from "./EditIssueButton";
import IssueDetails from "./IssueDetails";

const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});
interface Props {
  params: { id: string };
}

const IssueDetailPage = async ({ params }: Props) => {
  const issue = await prisma.issue.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!issue) notFound();

  return (
    <Grid columns={{ initial: "1", md: "2" }} gap="5">
      <Box>
        <IssueDetails issue={issue} />
      </Box>
      <Box>
        <EditIssueButton issueID={issue.id} />
      </Box>
    </Grid>
  );
};

export default IssueDetailPage;
