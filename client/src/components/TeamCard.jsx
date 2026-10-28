import React from "react";
import "../styles/team.css";
const Team = (props) => {
  return (
    <>
      <div className="team-container m-5 w-auto md:w-1/5">
        <div className="row">
          <div className="col-sm-6 col-lg-3 my-auto">
            <div className="teamBox p-4">
              <div className="teamBox-desc">
                <h5>{props.title ?? props.name}</h5>
                <p>{props.body ?? props.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Team;
