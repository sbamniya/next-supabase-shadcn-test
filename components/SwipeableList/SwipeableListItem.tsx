import "./SwipeableList.css";
import React, { useRef, useEffect } from "react";

function SwipeableListItem({
  children,
  onDelete,
}: React.PropsWithChildren<{ onDelete: () => Promise<void> }>) {
  const listElementRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);

  const dragStartXRef = useRef(0);
  const leftRef = useRef(0);
  const draggedRef = useRef(false);

  useEffect(() => {
    window.addEventListener("mouseup", onDragEndMouse);
    window.addEventListener("touchend", onDragEndTouch);
    return () => {
      window.removeEventListener("mouseup", onDragEndMouse);
      window.removeEventListener("touchend", onDragEndTouch);
    };
  });

  function onDragStartMouse(evt: any) {
    onDragStart(evt.clientX);
    window.addEventListener("mousemove", onMouseMove);
  }

  function onDragStartTouch(evt: any) {
    console.log(evt.targetTouches);
    console.log(evt.targetTouches[0]);
    const touch = evt.targetTouches[0];
    onDragStart(touch.clientX);
    window.addEventListener("touchmove", onTouchMove);
  }

  function onDragStart(clientX: any) {
    draggedRef.current = true;
    dragStartXRef.current = clientX;

    if (listElementRef.current) {
      listElementRef.current.className = "ListItem";
    }

    requestAnimationFrame(updatePosition);
  }

  function updatePosition() {
    if (draggedRef.current) {
      requestAnimationFrame(updatePosition);
    }
    if (listElementRef.current) {
      listElementRef.current.style.transform = `translateX(${leftRef.current}px)`;
    }
  }

  function onMouseMove(evt: any) {
    const left = evt.clientX - dragStartXRef.current;
    if (left < 0) {
      leftRef.current = left;
    }
  }

  function onTouchMove(evt: any) {
    const touch = evt.targetTouches[0];
    const left = touch.clientX - dragStartXRef.current;
    if (left < 0) {
      leftRef.current = left;
    }
  }

  function onDragEndMouse() {
    window.removeEventListener("mousemove", onMouseMove);
    onDragEnd();
  }

  function onDragEndTouch() {
    window.removeEventListener("touchmove", onTouchMove);
    onDragEnd();
  }

  function onDragEnd() {
    if (draggedRef.current) {
      draggedRef.current = false;
      const threshold = 0.5;

      if (
        listElementRef.current &&
        leftRef.current < listElementRef.current.offsetWidth * threshold * -1
      ) {
        leftRef.current = -listElementRef.current.offsetWidth * 2;

        if (wrapperRef.current) {
          //confirm delete
          wrapperRef.current.style.maxHeight = "0";
          onDelete();
        }
      } else {
        leftRef.current = 0;
      }
      if (listElementRef.current) {
        listElementRef.current.className = "BouncingListItem";
        listElementRef.current.style.transform = `translateX(${leftRef.current}px)`;
      }
    }
  }

  return (
    <>
      <div className="Wrapper" ref={wrapperRef}>
        <div className="Background" ref={backgroundRef}>
          <span>delete</span>
        </div>
        <div
          className="BouncingListItem"
          ref={listElementRef}
          onMouseDown={onDragStartMouse}
          onTouchStart={onDragStartTouch}
        >
          {children}
        </div>
      </div>
    </>
  );
}

export default SwipeableListItem;
