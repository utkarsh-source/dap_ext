import React from "react";
import ReactLoading from "react-loading";
import { getAnnoucementsByUser } from "../action/action";
import { useContext, useEffect } from "react";
import { AppContext } from "../../AppContext";
import { MdClose } from "react-icons/md";
import {
  AnnoucemnetBody,
  AnnouncementBox,
  Badge,
  ButtonRounded,
  From,
  Loader,
  Ruler,
  Subject,
} from "../styled-component";

function Annoucement({ toggle, setToggle }) {
  const {
    dispatch,
    state: {
      login: { token, databaseID },
      annoucement: { data, isLoading },
    },
  } = useContext(AppContext);

  useEffect(() => {
    if (!toggle) return;
    const userName = "utkarsh";
    getAnnoucementsByUser(dispatch, databaseID, token, userName);
  }, [toggle]);

  return (
    <AnnouncementBox toggle={toggle || undefined}>
      <ButtonRounded onClick={() => setToggle(false)}>
        <MdClose />
      </ButtonRounded>
      {data?.length > 0 && (
        <ul className="overflow-y-auto h-full">
          {data.map((item) => {
            return (
              <li key={item.AnnouncementID}>
                <p>
                  <span>from </span> :{" "}
                  <From as="label">{item.AnnouncementCreatorName}</From>
                </p>
                <p>
                  <span>subject</span> :
                  <Subject as="label">{item.AnnouncementTitle}</Subject>
                </p>
                <Ruler style={{ marginTop: "25px" }} />
                <AnnoucemnetBody>{item.AnnouncementBody}</AnnoucemnetBody>
              </li>
            );
          })}
        </ul>
      )}
      <Badge className="absolute top-0 left-6 -translate-y-[50%] bg-purple-700 text-white  py-0.5 px-4 rounded-md">
        Annoucement
      </Badge>
      {isLoading && (
        <Loader className="center absolute">
          <ReactLoading
            type="spinningBubbles"
            height={30}
            width={30}
            color="black"
          />
        </Loader>
      )}
    </AnnouncementBox>
  );
}

export default Annoucement;
