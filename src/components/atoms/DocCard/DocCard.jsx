import React from "react";
import Image from "next/image";
import { IoEyeOutline } from "react-icons/io5";
import classes from "./DocCard.module.css";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { mergeClass } from "@/resources/utils/helper";
import { BsPatchCheck } from "react-icons/bs";
import { IoFolderOutline } from "react-icons/io5";

export default function DocCard({
  data,
  // title = "Document 1",
  // dateTime = "12/29/2023 10:20",
  // visibilityText = "Visible to client",
  // trademarkName = "",
  // clientName = "Virgil Kovacek",
  // trademarkNo = "R-3526",
  // caseType = "Design invalidation",
  // isDetailedVariant = false,
}) {
  return (
    <div
      className={mergeClass(
        classes.card,
        data?.isDetailedVariant && classes.isDetailedVariantCard
      )}
    >
      <div
        className={
          data?.isDetailedVariant
            ? classes.isDetailedVariantContent
            : classes.content
        }
      >
        <div className={classes.imageContainer}>
          <Image
            src="/app-images/doc.svg"
            alt="Document"
            width={58}
            height={52}
            className={classes.image}
          />
        </div>
        <div
          className={mergeClass(
            classes.details,
            data?.isDetailedVariant && classes.isDetailedVariantDetails
          )}
        >
          <h3 className={classes.title}>{data?.title}</h3>
          <p className={classes.dateTime}>{data?.dateTime}</p>
          {data?.visibilityText && !data?.isDetailedVariant && (
            <div className={classes.visibility}>
              <IoEyeOutline className={classes.eyeIcon} />
              <span className={classes.visibilityText}>
                {data?.visibilityText}
              </span>
            </div>
          )}
          {data?.isDetailedVariant && (
            <>
              <div className={classes.infoRow}>
                <BsPatchCheck className={classes.infoIcon} />
                <span className={classes.infoLabel}>
                  Trademark No. -{" "}
                  <strong className={classes.statusVariantUnderlined}>
                    {data?.trademarkNo}
                  </strong>
                </span>
              </div>
              {data?.trademarkName && (
                <div className={classes.infoRow}>
                  <BsPatchCheck className={classes.infoIcon} />
                  <span className={classes.infoLabel}>
                    Trademark Name - <strong>{data?.trademarkName}</strong>
                  </span>
                </div>
              )}
              {data?.clientName && (
                <div className={classes.infoRow}>
                  <BsPatchCheck className={classes.infoIcon} />
                  <span className={classes.infoLabel}>
                    Client Name - <strong>{data?.clientName}</strong>
                  </span>
                </div>
              )}
              <div className={classes.infoRow}>
                <IoFolderOutline className={classes.infoIcon} />
                <span className={classes.infoLabel}>
                  Case Type - <strong>{data?.caseType}</strong>
                </span>
              </div>
            </>
          )}
        </div>
      </div>
      <div className={classes.options}>
        <HiOutlineDotsVertical size={24} color="var(--sky-blue)" />
      </div>
    </div>
  );
}
