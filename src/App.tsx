import React, { useState } from "react";
import { IGenericAPIResponse, IShortUrlResponse } from "./interfaces/url";
import { CopyIcon } from "./assets/copy";
import { CopiedIcon } from "./assets/copied";
import QRCode from "react-qr-code";
import { Footer } from "./Footer";

enum E_CURRENT_STEP {
  SHORTEN = "1",
  RETRIEVE = "2",
}

const isValidUrl = (url: string) => {
  const urlPattern =
    /^(https?:\/\/)?([\w\-]+(\.[\w\-]+)+)([\w\-._~:/?#[\]@!$&'()*+,;=.]+)?$/;
  return urlPattern.test(url);
};

function App() {
  const [url, setUrl] = useState("");
  const [shortUrlData, setShortUrlData] = useState<IShortUrlResponse>();
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState({ isError: false, message: "" });
  const [currentStep, setCurrentStep] = useState<E_CURRENT_STEP>(
    E_CURRENT_STEP.SHORTEN
  );
  const isShorting = currentStep === E_CURRENT_STEP.SHORTEN;
  const respectiveUrl = isShorting
    ? shortUrlData?.shortUrl
    : shortUrlData?.originalUrl;

  const handleCopy = () => {
    const toCopy = isShorting
      ? shortUrlData?.shortUrl
      : shortUrlData?.originalUrl;
    navigator.clipboard.writeText(toCopy || "").then(() => {
      setIsCopied(true);
      const tm = setTimeout(() => {
        setIsCopied(false);
        clearTimeout(tm);
      }, 3000);
    });
  };

  const resetErrors = () => {
    setError({
      isError: false,
      message: "",
    });
  };

  const shortenUrl = () => {
    const result = isValidUrl(url);
    if (!result) {
      setError({
        isError: true,
        message: url.length ? "Please enter a valid URL" : "Please enter a URL",
      });
      return;
    }
    setIsLoading(true);
    fetch(`http://localhost:3300/url/short-url`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        mode: "nocors",
      },
      body: JSON.stringify({ url: url.trim() }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data: IGenericAPIResponse<IShortUrlResponse>) => {
        const fullShortenUrl = `http://localhost:3300/${data?.data?.shortUrl}`;
        const required = isShorting ? fullShortenUrl : data?.data?.originalUrl;
        if (required.trim().toLowerCase() === url.trim().toLowerCase()) {
          setError({
            isError: true,
            message: isShorting ? "Invalid Original URL" : "Invalid Short URL",
          });
          return;
        }
        resetErrors();
        setShortUrlData({
          ...data.data,
          shortUrl: fullShortenUrl,
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      })
      .finally(() => setIsLoading(false));
  };

  const handleOriginalUrlRetrieve = () => {
    setShortUrlData(undefined);
    resetErrors();
    setCurrentStep(
      isShorting ? E_CURRENT_STEP.RETRIEVE : E_CURRENT_STEP.SHORTEN
    );
  };

  React.useEffect(() => {
    document.title = "Url Shortener";
  }, []);

  return (
    <div className="bg-gradient-to-r from-slate-400 to-slate-300 min-h-screen h-1/1 w-1/1 flex flex-col justify-between items-center bg-gray-100">
      <div className="h-auto w-screen flex flex-col items-center mt-12">
        <h1 className="text-3xl font-bold mb-6">URL Shortener</h1>
        <div className="flex flex-col bg-white px-8 py-12 rounded shadow-md w-11/12 md:w-2/3">
          <div className="flex flex-col md:flex-row w-full">
            <div className="flex flex-col w-full">
              <input
                type="text"
                placeholder={
                  isShorting
                    ? "Enter your original URL"
                    : "Enter your short URL"
                }
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-3 h-12 border rounded hover:border-slate-400 focus:border-slate-400 peer p-3 peer-invalid:border-red-500 peer-invalid:ring-red-500"
              />
              {error.isError ? (
                <p className="mt-2 text-pink-600 text-sm">{error.message}</p>
              ) : null}
            </div>
            <button
              onClick={shortenUrl}
              className={`flex-shrink-0 h-10 sm:w-36 rounded md:h-12 px-4 mt-4 md:ml-2 md:mt-0 ${
                isLoading ? "bg-blue-300" : "bg-blue-500"
              } text-white`}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-l-2 border-white-900"></div>
                </div>
              ) : isShorting ? (
                "Shorten URL"
              ) : (
                "Get Original"
              )}
            </button>
          </div>
          <p
            className="mt-2 text-blue-400 text-sm md:self-end self-center cursor-pointer hover:underline"
            onClick={handleOriginalUrlRetrieve}
          >
            {isShorting ? "Already shortened?" : "Want to short?"}
          </p>
          <div>
            {respectiveUrl && (
              <div className="flex flex-col mt-4">
                <div className="flex flex-row">
                  <p className="flex flex-row flex-wrap text-gray-700">
                    {isShorting ? "Shortened URL:" : "Original URL:"}
                    <span className="flex flex-row items-center">
                      <a
                        href={respectiveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500"
                      >
                        <p className="ml-1 hover:underline">
                          {respectiveUrl || ""}
                        </p>
                      </a>
                      <div className="ml-2 cursor-pointer" onClick={handleCopy}>
                        {!isCopied ? (
                          <CopyIcon currentColor={"gray"} />
                        ) : (
                          <CopiedIcon currentColor={"gray"} />
                        )}
                      </div>
                    </span>
                  </p>
                </div>
                {isShorting && (
                  <p className="text-gray-700">
                    Visits: {shortUrlData?.visitCount}
                  </p>
                )}
                <QRCode
                  size={24}
                  className="h-36 w-36 self-center mt-4"
                  value={respectiveUrl}
                  viewBox={`0 0 24 24`}
                />
                <p className="font-thin text-xs self-center mt-2">
                  Qr code of {isShorting ? "Short URL" : "Original URL"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;
