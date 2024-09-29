import React, { useEffect, useRef, useState } from "react";
import moment from "moment";
import { RxCross1 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { raiseQuery } from "../../../redux/apis/beneficiariesAPI";
import { Link } from "react-router-dom";
import { IoDocument, IoAttach } from "react-icons/io5";
import { RxCrossCircled } from "react-icons/rx";
import toast from "react-hot-toast";

const QueriesModal = ({
  closeModal,
  queries,
  setRecallAPI,
  recallAPI,
  beneficiaryId,
}) => {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);

  const scrollRef = useRef(null);
  const dispatch = useDispatch();
  const { userId } = useSelector((state) => state.userDetailsSlice.details);

  const setRole = (userRole) => {
    if (userRole === "1") {
      return "Verifier";
    } else if (userRole === "2") {
      return "Finance";
    } else if (userRole === "3") {
      return "DC Administration";
    } else {
      return "Inputer";
    }
  };

  const handleQueryAPI = () => {
    const formData = new FormData();
    formData.append("beneficiaryId", beneficiaryId);
    formData.append("userId", userId);
    formData.append("message", message);
    formData.append("attachment", file);

    // Raise Query API
    dispatch(raiseQuery(formData)).then((res) => {
      if (res.success) {
        toast.success(res.message);
        setRecallAPI(!recallAPI);
        closeModal();
      } else {
        toast.error(res.message);
      }
    });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const renderAttachment = (attachment, bool, attachmentName) => {
    const fileExtension = attachment.split(".").pop().toLowerCase();
    if (["png", "jpg", "jpeg", "gif"].includes(fileExtension)) {
      return (
        <Link
          to={attachment}
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-pointer"
        >
          <img
            src={attachment}
            alt="attachment"
            className="max-w-[225px] rounded-lg my-2 h-auto object-contain transition duration-300 hover:shadow-2xl"
          ></img>
        </Link>
      );
    } else {
      return (
        <Link
          to={attachment}
          target="_blank"
          rel="noopener noreferrer"
          className={`cursor-pointer flex ${
            bool ? "justify-end" : "justify-start"
          }`}
        >
          <div className="relative flex items-center justify-start gap-1 max-w-[225px] transition duration-300 rounded-lg my-2 p-2 shadow-md backdrop-blur-lg text-gray-700 bg-white/80 hover:shadow-2xl">
            <span className="text-green-600">
              <IoDocument size={24} />
            </span>
            <span className="block overflow-hidden text-ellipsis whitespace-nowrap text-sm font-medium">
              {attachmentName}
            </span>
          </div>
        </Link>
      );
    }
  };

  useEffect(() => {
    // Set a timeout to allow the render to complete before scrolling
    const scrollToBottom = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollTo({
          top: scrollRef.current.scrollHeight,
          behavior: "smooth", // Enables smooth scrolling
        });
      }
    };
    // Call scrollToBottom again after a short delay
    setTimeout(scrollToBottom, 100);
  }, [queries]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full p-6 m-5">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-300">
          <h2 className="text-xl font-semibold">Queries</h2>
          <button
            className="text-gray-500 hover:text-gray-800"
            onClick={() => closeModal()}
          >
            <RxCross1 />
          </button>
        </div>

        {/* Messages */}
        <div
          className="mt-4 max-h-96 overflow-y-auto hide-scrollbar"
          ref={scrollRef}
        >
          {queries?.map((msg, index) =>
            msg.message === "---@over@---" ? (
              <div
                key={index}
                className={`my-5 text-xs font-semibold text-gray-500 flex justify-center items-center`}
              >
                <div className="border border-gray-300 flex-1"></div><div className="p-2">Previous
                Queries</div><div className="border border-gray-300 flex-1"></div>
              </div>
            ) : (
              <div
                key={index}
                className={`flex ${
                  msg.userId === userId ? "justify-end" : "justify-start"
                } mb-4`}
              >
                <div
                  className={`max-w-xs p-4 rounded-lg shadow ${
                    msg.userId === userId
                      ? "bg-green-100 text-right"
                      : "bg-yellow-100 text-left"
                  }`}
                >
                  <p>{msg.message}</p>
                  {msg.attachment &&
                    renderAttachment(
                      msg.attachment,
                      msg.userId === userId,
                      msg.attachmentName
                    )}
                  <small className="block mt-2 text-gray-500">
                    By {msg.userId === userId ? "You" : msg.userName} -{" "}
                    {setRole(msg.userRole)} on{" "}
                    {moment(msg.updatedAt).format("DD MMM YYYY - hh:mmA")}
                  </small>
                </div>
              </div>
            )
          )}
        </div>

        {/* Input Section */}
        <div>
          {file && (
            <>
              <hr />
              <div className="relative flex items-center w-[225px] justify-between border border-gray-300 rounded-lg mt-3 p-2 shadow-md backdrop-blur-lg text-gray-700 bg-white/80">
                {/* Document Icon */}
                <span className="text-green-600">
                  <IoDocument size={24} />
                </span>

                {/* File name */}
                <span className="block flex-1 overflow-hidden text-ellipsis whitespace-nowrap ml-3 text-sm font-medium">
                  {file.name}
                </span>

                {/* Close button */}
                <RxCrossCircled
                  onClick={() => setFile("")}
                  className="text-red-500 hover:text-white hover:bg-red-500 absolute font-extrabold right-[-6px] top-[-6px] bg-white rounded-full cursor-pointer"
                  size={20}
                />
              </div>
            </>
          )}
          <div className="mt-3 flex gap-2 w-full items-center  border-2 border-gray-500 p-1 rounded-xl px-2">
            <label
              htmlFor="attachDoc"
              className="cursor-pointer text-gray-600 p-2"
            >
              <IoAttach size={24} />
              <input
                type="file"
                className="mb-2 hidden"
                onChange={(e) => handleFileChange(e)}
                id="attachDoc"
              />
            </label>
            <div className="w-full">
              <input
                type="text"
                className="w-full rounded-lg px-1 py-2 outline-none"
                placeholder="Write your query here..."
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value.replace(/\s+/g, " "));
                }}
              />
            </div>
            <div className="flex items-center">
              <button
                onClick={() => {
                  handleQueryAPI();
                }}
                disabled={!message && !file}
                className={`ml-2 px-6 py-1 ${
                  message || file
                    ? "bg-blue-500 hover:bg-blue-600"
                    : "bg-blue-300 cursor-not-allowed"
                } text-white rounded-lg`}
              >
                SEND
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueriesModal;
