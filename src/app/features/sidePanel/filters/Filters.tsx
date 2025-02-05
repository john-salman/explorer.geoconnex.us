import Card from "@/app/components/common/Card"
import { RootState } from "@/lib/state/store";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Types } from "@/app/features/sidePanel/filters/Types";
import { Variables } from "@/app/features/sidePanel/filters/Variables";

export const Filters: React.FC = () => {

    return( <Card>
        <Types />
        <Variables />
    </Card>)
}