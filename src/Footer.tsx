import { SecureIcon } from "./assets/secure";
import { FastIcon } from "./assets/fast";
import { ReliableIcon } from "./assets/reliable";

function Footer() {
  return (
    <div className="mt-16 mb-4">
      <div className="flex flex-row gap-4 md:gap-16 items-center mb-10">
        <div className="flex flex-col w-24 items-center">
          <SecureIcon currentColor="#497dd1" />
          <p className="text-sm font-light text-slate-600">Secure</p>
        </div>
        <div className="flex flex-col w-24 items-center">
          <FastIcon currentColor="#479e67" />
          <p className="text-sm font-light text-slate-600">Fast</p>
        </div>
        <div className="flex flex-col w-24 items-center">
          <ReliableIcon currentColor="#b54c67" />
          <p className="text-sm font-light text-slate-600">Reliable</p>
        </div>
      </div>
      <p className="text-center text-lg text-gray-700">
        Made with ❤️ by Hard Patel
      </p>
    </div>
  );
}

export { Footer };
