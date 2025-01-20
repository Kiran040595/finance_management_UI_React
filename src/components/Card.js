import React from 'react';
import CountUp from 'react-countup';

const Card = ({ title, value, icon: Icon, backgroundColor, textColor }) => {
  return (
    <div
      className={`p-4 rounded-lg shadow-md flex items-center`}
      style={{ backgroundColor, color: textColor }}
    >
      {Icon && <Icon className="w-10 h-10 mr-4" />}
      <div>
        <h4 className="text-lg font-semibold">{title}</h4>
        <p className="text-2xl font-bold">
          <CountUp start={0} end={value} duration={2.5} />
        </p>
      </div>
    </div>
  );
};

export default Card;
