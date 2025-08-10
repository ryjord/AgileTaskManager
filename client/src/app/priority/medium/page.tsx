import React from "react";
import ReusablePriorityPage from "../reusablePriorityPage";
import { TaskPriority } from "@/state/api";

const Urgent = () => {
  return <ReusablePriorityPage priority={TaskPriority.MEDIUM} />;
};

export default Urgent;