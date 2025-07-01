import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { div } from "framer-motion/client";
import { useNavigate } from "react-router-dom";

const PlaceOrder = () => {
  const { currency, deliveryFee, totalCost, addToOrder } =
    useContext(ShopContext);
  const [selectedPayment, setSelectedPayment] = useState("");
  const navigate = useNavigate();

  const redirect = () => {
    useEffect(() => {
      navigate("/cart");
    }, [navigate]);
    return "Redirecting";
  };

  return (
    <div>
      <div className="mt-25 border-t-1 border-gray-200">
        <section className="bg-white py-8 antialiased md:py-16">
          <form action="#" className="mx-auto max-w-screen-xl px-4 2xl:px-0">
            <ol className="items-center flex w-full max-w-2xl text-center text-sm font-medium text-gray-500 sm:text-base">
              <li className="after:border-1 flex items-center text-primary-700 after:mx-6 after:hidden after:h-1 after:w-full after:border-b after:border-gray-200 sm:after:inline-block sm:after:content-[''] md:w-full xl:after:mx-10">
                <span className="flex items-center after:mx-2 after:text-gray-200 after:content-['/'] sm:after:hidden">
                  <svg
                    className="me-2 h-4 w-4 sm:h-5 sm:w-5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                  Cart
                </span>
              </li>

              <li className="after:border-1 flex items-center text-primary-700 after:mx-6 after:hidden after:h-1 after:w-full after:border-b after:border-gray-200 sm:after:inline-block sm:after:content-[''] md:w-full xl:after:mx-10">
                <span className="flex items-center after:mx-2 after:text-gray-200 after:content-['/'] sm:after:hidden">
                  <svg
                    className="me-2 h-4 w-4 sm:h-5 sm:w-5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                  Checkout
                </span>
              </li>

              <li className="flex shrink-0 items-center">
                <svg
                  className="me-2 h-4 w-4 sm:h-5 sm:w-5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
                Order summary
              </li>
            </ol>

            <div className="mt-6 sm:mt-8 lg:flex lg:items-start lg:gap-12 xl:gap-16">
              <div className="min-w-0 flex-1 space-y-8">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Delivery Details
                  </h2>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-900">
                        Your name
                      </label>
                      <input
                        type="text"
                        id="your_name"
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500"
                        placeholder="abcd defg"
                        required
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-900">
                        Your email*
                      </label>
                      <input
                        type="email"
                        id="your_email"
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500"
                        placeholder="name@gmail.com"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="mb-2 block text-sm font-medium text-gray-900"
                      >
                        Phone Number*
                      </label>
                      <div className="flex items-center">
                        <p className="pl-1 pr-1 pt-2.5 pb-2.5 bg-gray-300 rounded-l-lg text-sm">
                          +91{" "}
                        </p>
                        <input
                          type="text"
                          id="phone-number"
                          className="block w-full rounded-r-lg border-r-b-t border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500"
                          placeholder="1234567890"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="mb-2 block text-sm font-medium text-gray-900"
                      >
                        House/Flat no., Street-Name*
                      </label>
                      <input
                        type="text"
                        id="house-no"
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500"
                        placeholder="23/2, abc buiding, def street"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="mb-2 block text-sm font-medium text-gray-900"
                      >
                        City*
                      </label>
                      <input
                        type="text"
                        id="City"
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500"
                        placeholder="eg. Kandhla"
                        required
                      />
                    </div>

                    <div>
                      <div className="mb-2 flex items-center gap-2">
                        <label className="block text-sm font-medium text-gray-900">
                          District*
                        </label>
                      </div>
                      <input
                        type="text"
                        id="District"
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500"
                        placeholder="eg. Shamli"
                        required
                      />
                    </div>

                    <div>
                      <div className="mb-2 flex items-center gap-2">
                        <label className="block text-sm font-medium text-gray-900">
                          State*
                        </label>
                      </div>
                      <input
                        type="text"
                        id="State"
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500"
                        placeholder="eg. Uttar Pradesh"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="mb-2 block text-sm font-medium text-gray-900"
                      >
                        Pincashe*
                      </label>
                      <input
                        type="text"
                        id="pincashe"
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500"
                        placeholder="1234567"
                        required
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <button
                        type="submit"
                        className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100"
                      >
                        <svg
                          className="h-5 w-5"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 12h14m-7 7V5"
                          />
                        </svg>
                        Add new address
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Choose Payment Method
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Cash on Delivery */}
                    <div
                      className={`relative cursor-pointer rounded-xl border-2 p-6 transition-all duration-300 hover:shadow-lg ${
                        selectedPayment === "cash"
                          ? "border-blue-500 bg-blue-50 shadow-md ring-2 ring-blue-200"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedPayment("cash")}
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`flex-shrink-0 rounded-full p-3 ${
                            selectedPayment === "cash"
                              ? "bg-blue-100"
                              : "bg-gray-100"
                          }`}
                        >
                          <svg
                            className={`h-6 w-6 ${
                              selectedPayment === "cash"
                                ? "text-blue-600"
                                : "text-gray-600"
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h3
                            className={`font-semibold ${
                              selectedPayment === "cash"
                                ? "text-blue-900"
                                : "text-gray-900"
                            }`}
                          >
                            Cash on Delivery
                          </h3>
                          <p
                            className={`text-sm ${
                              selectedPayment === "cash"
                                ? "text-blue-700"
                                : "text-gray-500"
                            }`}
                          >
                            Pay when you receive
                          </p>
                        </div>
                        <div
                          className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                            selectedPayment === "cash"
                              ? "border-blue-500 bg-blue-500"
                              : "border-gray-300"
                          }`}
                        >
                          {selectedPayment === "cash" && (
                            <svg
                              className="h-3 w-3 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                      </div>
                      {selectedPayment === "cash" && (
                        <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <svg
                              className="h-4 w-4 text-green-600"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span className="text-sm text-green-800 font-medium">
                              No processing fees
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Online Payment */}
                    <div
                      className={`relative cursor-pointer rounded-xl border-2 p-6 transition-all duration-300 hover:shadow-lg ${
                        selectedPayment === "online"
                          ? "border-emerald-500 bg-emerald-50 shadow-md ring-2 ring-emerald-200"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedPayment("online")}
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`flex-shrink-0 rounded-full p-3 ${
                            selectedPayment === "online"
                              ? "bg-emerald-100"
                              : "bg-gray-100"
                          }`}
                        >
                          <svg
                            className={`h-6 w-6 ${
                              selectedPayment === "online"
                                ? "text-emerald-600"
                                : "text-gray-600"
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                            />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h3
                            className={`font-semibold ${
                              selectedPayment === "online"
                                ? "text-emerald-900"
                                : "text-gray-900"
                            }`}
                          >
                            Online Payment
                          </h3>
                          <p
                            className={`text-sm ${
                              selectedPayment === "online"
                                ? "text-emerald-700"
                                : "text-gray-500"
                            }`}
                          >
                            UPI, Cards, Net Banking
                          </p>
                        </div>
                        <div
                          className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                            selectedPayment === "online"
                              ? "border-emerald-500 bg-emerald-500"
                              : "border-gray-300"
                          }`}
                        >
                          {selectedPayment === "online" && (
                            <svg
                              className="h-3 w-3 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                      </div>
                      {selectedPayment === "online" && (
                        <div className="mt-4 p-3 bg-emerald-100 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <svg
                              className="h-4 w-4 text-emerald-600"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span className="text-sm text-emerald-800 font-medium">
                              Secure & Fast
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="voucher"
                    className="mb-2 block text-sm font-medium text-gray-900"
                  >
                    Enter a gift card, voucher or promotional cashe
                  </label>
                  <div className="flex max-w-md items-center gap-4">
                    <input
                      type="text"
                      id="voucher"
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500"
                      placeholder=""
                      required
                    />
                    <button
                      type="button"
                      className="flex items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6 w-full space-y-6 sm:mt-8 lg:mt-0 lg:max-w-xs xl:max-w-md">
                <div className="flow-root">
                  <div className="-my-3 divide-y divide-gray-200">
                    <dl className="flex items-center justify-between gap-4 py-3">
                      <dt className="text-base font-normal text-gray-500">
                        Subtotal
                      </dt>
                      <dd className="text-base font-medium text-gray-900">
                        {currency}
                        {totalCost}
                      </dd>
                    </dl>

                    <dl className="flex items-center justify-between gap-4 py-3">
                      <dt className="text-base font-normal text-gray-500">
                        Savings
                      </dt>
                      <dd className="text-base font-medium text-green-500">
                        - {currency}135
                      </dd>
                    </dl>

                    <dl className="flex items-center justify-between gap-4 py-3">
                      <dt className="text-base font-normal text-gray-500">
                        Delivery Fee
                      </dt>
                      <dd className="text-base font-medium text-gray-900">
                        {currency}
                        {deliveryFee}
                      </dd>
                    </dl>

                    <dl className="flex items-center justify-between gap-4 py-3">
                      <dt className="text-base font-normal text-gray-500">
                        Tax
                      </dt>
                      <dd className="text-base font-medium text-gray-900">
                        {currency}199
                      </dd>
                    </dl>

                    <dl className="flex items-center justify-between gap-4 py-3">
                      <dt className="text-base font-bold text-gray-900">
                        Total
                      </dt>
                      <dd className="text-base font-bold text-gray-900">
                        {currency}
                        {totalCost + deliveryFee + 199}
                      </dd>
                    </dl>
                  </div>
                </div>

                <div className="space-y-3 flex justify-center">
                  <button
                    type="submit"
                    className="flex w-80 items-center justify-center rounded-sm bg-gray-200 px-5 py-2.5 text-sm font-medium text-black hover:bg-gray-800 hover:text-white"
                    onClick={() => {
                      addToOrder({
                        payment: selectedPayment,
                        tCost: totalCost + deliveryFee + 199,
                      });
                      // navigate('/');
                    }}
                  >
                    Proceed to Payment
                  </button>
                </div>
              </div>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default PlaceOrder;
