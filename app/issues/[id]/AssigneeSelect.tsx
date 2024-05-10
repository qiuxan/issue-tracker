"use client";
import { Issue, User } from "@prisma/client";
import { Select } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";

const AssigneeSelect = ({ issue }: { issue: Issue }) => {
  const {
    data: users,
    error,
    isLoading,
  } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => axios.get("/api/v1/users").then((res) => res.data),
    staleTime: 1000 * 60, // 1 minute
    retry: 3,
  });

  if (isLoading) return <Skeleton />;

  if (error) return null;

  return (
    <Select.Root
      defaultValue={issue.assignedToUserId || ""}
      onValueChange={(userId) => {
        axios.patch(`/api/v1/issues/${issue.id}`, {
          assignedToUserId: userId || null,
        });
      }}
    >
      <Select.Trigger placeholder="Assign..." />

      <Select.Content>
        <Select.Group>
          <Select.Label>Suggestions</Select.Label>
          <Select.Item value="">Unassign</Select.Item>
          {users?.map((user) => (
            <Select.Item key={user.id} value={user.id}>
              {user.name}
            </Select.Item>
          ))}
        </Select.Group>
      </Select.Content>
    </Select.Root>
  );
};

export default AssigneeSelect;
