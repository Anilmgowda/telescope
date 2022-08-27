import React from "react";
import ReactDom from "react-dom";

import { useOfflineDetection } from "../../customHooks";

import "./OfflineView.scss";

const OfflineView = ({ children }) => {
  const { isOnline } = useOfflineDetection();

  // const { translate } = useTranslate();

  const renderOverlay = () => {
    return ReactDom.createPortal(
      <div className="offline-container">
        <div className="offline-card">
          <div className="offline-card--info">
            <h2>I am offline</h2>
            <h5>Please wait</h5>
          </div>
          <div className="offline-card--image">
            <img
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAlgAAACwCAYAAADT7hAaAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6ODFBOUE2RkEzMjc0MTFFODk1NkVDRDU0OTQ0MDFGNEUiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6ODFBOUE2RjkzMjc0MTFFODk1NkVDRDU0OTQ0MDFGNEUiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NkREQzFBQjEzMjZFMTFFODg0RTY5NjM0MTdBQ0M3MUEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NkREQzFBQjIzMjZFMTFFODg0RTY5NjM0MTdBQ0M3MUEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz72nzwYAAAk1UlEQVR42uzd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"
              alt=""
            />
          </div>
        </div>
      </div>,
      document.body
    );
  };

  return (
    <>
      {children}
      {!isOnline && renderOverlay()}
    </>
  );
};

export default OfflineView;