import React, { useRef } from "react";
import Page from "../../components/Page";
import { CURRENCIES } from "../../config/currencies.config";
import { saveStoreSettings, useStoreSettings } from "../../controllers/settings.controller";
import {toast} from "react-hot-toast"
import { mutate } from "swr";
export default function SettingDetailsPage() {
  const storeNameRef = useRef();
  const addressRef = useRef();
  const emailRef = useRef();
  const phoneRef = useRef();
  const currencyRef = useRef();

  const { APIURL, data, error, isLoading } = useStoreSettings();

  if(isLoading) {
    return <Page className="px-8 py-6">Please wait...</Page>
  }

  if(error) {
    console.error(error);
    return <Page className="px-8 py-6">Error loading data, Try Later!</Page>;
  }

  const { storeName, email, address, phone, currency } = data;

  const btnSave = async () => {
    const storeName = storeNameRef.current.value;
    const address = addressRef.current.value;
    const email = emailRef.current.value;
    const phone = phoneRef.current.value;
    const currency = currencyRef.current.value;

    try {

      toast.loading("Please wait...");
      const res = await saveStoreSettings(storeName, address, phone, email, currency, null);

      if(res.status == 200) {
        await mutate(APIURL);
        toast.dismiss();
        toast.success(res.data.message);
      }
      
    } catch (error) {
      const message = error?.response?.data?.message || "Something went wrong!";
      console.error(error);

      toast.dismiss();
      toast.error(message);
    }
  };

  return (
    <Page className="px-8 py-6">
      <h3 className="text-3xl font-light">Store Details</h3>

      <div className="mt-8 text-sm text-gray-500">
        <div>
          <label htmlFor="name" className="block mb-1">
            Store Name
          </label>
          <input
            ref={storeNameRef}
            type="text"
            name="name"
            id="name"
            defaultValue={storeName}
            placeholder="Enter Store Name here..."
            className="block w-full lg:min-w-96 border rounded-lg px-4 py-2 bg-gray-50 outline-resolute-border-light"
          />
        </div>
        <div className="mt-4">
          <label htmlFor="address" className="block mb-1">
            Address
          </label>
          <textarea
            ref={addressRef}
            type="text"
            name="address"
            id="address"
            defaultValue={address}
            placeholder="Enter Store Address here..."
            className="block w-full h-20 lg:min-w-96 border rounded-lg px-4 py-2 bg-gray-50 outline-resolute-border-light"
          />
        </div>
        <div className="mt-4">
          <label htmlFor="email" className="block mb-1">
            Email
          </label>
          <input
            ref={emailRef}
            type="email"
            name="email"
            id="email"
            defaultValue={email}
            placeholder="Enter Email here..."
            className="block w-full lg:min-w-96 border rounded-lg px-4 py-2 bg-gray-50 outline-resolute-border-light"
          />
        </div>
        <div className="mt-4">
          <label htmlFor="phone" className="block mb-1">
            Phone
          </label>
          <input
            ref={phoneRef}
            type="tel"
            name="phone"
            id="phone"
            defaultValue={phone}
            placeholder="Enter Phone here..."
            className="block w-full lg:min-w-96 border rounded-lg px-4 py-2 bg-gray-50 outline-resolute-border-light"
          />
        </div>
        <div className="mt-4">
          <label htmlFor="currency" className="block mb-1">
            Currency
          </label>
          <select
            ref={currencyRef}
            name="currency"
            id="currency"
            defaultValue={currency}
            placeholder="Select Currency"
            className="block w-full lg:min-w-96 border rounded-lg px-4 py-2 bg-gray-50 outline-resolute-border-light"
          >
            <option value="" hidden>
              Select Currency
            </option>
            {CURRENCIES.map((item, index) => {
              return (
                <option value={item.cc} key={index}>
                  {item.name} - ({item.symbol})
                </option>
              );
            })}
          </select>
        </div>

        <button onClick={btnSave} className="text-resolute-text w-full lg:min-w-96 bg-resolute-primary transition hover:bg-amber-500 active:scale-95 rounded-lg px-4 py-2 mt-6 outline-resolute-border-light">
          Save
        </button>
      </div>
    </Page>
  );
}
