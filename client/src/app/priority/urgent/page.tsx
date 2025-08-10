import React from "react";
import ReusablePriorityPage from "../reusablePriorityPage";
import { TaskPriority } from "@/state/api";

const Urgent = () => {
  return <ReusablePriorityPage priority={TaskPriority.CRITICAL} />;
};

export default Urgent;