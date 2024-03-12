import React, { useEffect, useState } from "react";
import ActivityCard from "./ActivityCard";
import { ResponseGetAllPostsSanityService } from "../../sanity/services";
type ListActivity = {
  activityPosts: ResponseGetAllPostsSanityService;
};

function ListActivity({ activityPosts }: ListActivity) {
  const [loader, setLoader] = useState(false);

  const activityCards = activityPosts?.map((card) => {
    return (
      <ul className="item-center list-none pl-0" key={card._id}>
        <li>
          <div>
            <ActivityCard
              price={card.price}
              setLoader={setLoader}
              id={card._id}
              slug={card.slug.current}
              likes={card?.likes}
              video={card?.video}
              game={card?.game}
              description={card.description}
              title={card.title}
              image={card.mainImage.asset._ref}
            />
          </div>
        </li>
      </ul>
    );
  });

  return (
    <div className="z-10 pt-5 relative">
      <div className="flex gap-10 items-center justify-center flex-wrap text-center bg-transparent border-0">
        {activityCards}
      </div>
    </div>
  );
}

export default ListActivity;
