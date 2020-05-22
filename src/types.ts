import { OnCreateItemSubscription, OnDeleteItemSubscription } from "./API";

export type Item = {
  id?: string | null;
  title: string;
  url: string;
  img: string;
};

export type FormValue = {
  value: string;
};

export type CreateSubscriptionEvent = {
  value: { data: OnCreateItemSubscription }
};

export type DeleteSubscriptionEvent = {
  value: { data: OnDeleteItemSubscription }
};

