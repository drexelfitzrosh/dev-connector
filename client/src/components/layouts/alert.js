import React from "react";
import PropType from "prop-types";
import { connect } from "react-redux";
const Alert = ({ alerts }) =>
  alerts !== null &&
  alerts.length > 0 &&
  alerts.map(alert => (
    <div key={alert.id} className={`alert alert-${alert.alertType}`}>
      {alert.msg}
    </div>
  ));
Alert.propType = {
  alerts: PropType.array.isRequired
};

const mapStateProps = state => ({
  alerts: state.alert
});
export default connect(mapStateProps)(Alert);
