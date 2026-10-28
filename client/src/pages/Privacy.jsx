import React, { useEffect } from "react";
import SiteHeader from "../components/layout/SiteHeader";
import SiteFooter from "../components/layout/SiteFooter";

export default function Privacy() {
  useEffect(() => {
    document.title = "Terms and Conditions · WorkWave";
  }, []);

  return (
    <div className="site">
      <SiteHeader />
      <main id="main">
        <div className="bg-paper px-margin pb-section pt-14 text-ink md:pt-20">
        <article className="mx-auto max-w-[56ch]">
          <h1 className="font-display text-head font-extrabold uppercase leading-[0.95] tracking-[-0.005em]">
            Terms and Conditions
          </h1>
          <h2 className="mt-12 font-display text-lead font-extrabold uppercase leading-[1.05] tracking-[-0.005em]">CODE OF HONOR</h2>
          <p className="mt-6 text-body">
            These Terms of Use (the “Terms”) are a binding contract between you
            and WorkWave(“WorkWave,” “we” and “us”). If you have any questions,
            comments, or concerns regarding these terms or the Services, please
            contact us.
          </p>
          <p className="mt-6 text-body">
            In these Terms, “User” means anyone who accesses and/or registers
            for our Services, including without limitation can extract services
            within our policies. violation of which will lead to blacklisting of
            the client.
          </p>
          <p className="mt-6 text-body">
            The client must respect the conditions asked by our members. once
            the amount is quoted by our employee and you agreed to it, it will
            be finalised . Further no alterations or changes will be made from
            any side ( yours and ours ), once we starts working on it. If the
            user faces any inappropriate behavior or actions by employees from
            our side he/she is adviced and has the freedom to report to us.
          </p>
          <h2 className="mt-12 font-display text-lead font-extrabold uppercase leading-[1.05] tracking-[-0.005em]">DEALING RULES</h2>
          <p className="mt-6 text-body">
            The users are striclty advised not provide any personal information
            to the employee other than what is asked. The privacy of the user is
            our top most priority. We keep your data safe and advice you to do
            the same.
          </p>
          <h2 className="mt-12 font-display text-lead font-extrabold uppercase leading-[1.05] tracking-[-0.005em]">PAYMENT POLICIES</h2>
          <p className="mt-6 text-body">
            The client hereby should pay the entire amount of the services
            required before hand. We ensure to provide best of our services
            within specified time. failing of which we ensure to return the
            amount with in 20-30 business days.
          </p>
          <h2 className="mt-12 font-display text-lead font-extrabold uppercase leading-[1.05] tracking-[-0.005em]">USE OF SERVICES</h2>
          <p className="mt-6 text-body">
            WorkWave only authorizes you to use the Services and Content for your
            own personal use in compliance with all applicable laws. You may not
            resell or make any commercial use of the Services or any Content
            therein (other than your own Submissions). Any Content you access
            through the Services is licensed through your purchase of the
            Services personally to you to view and use the Content. “Content”
            means any information or materials displayed on the Services, such
            as, text, graphics, data, articles, photos, images, illustrations,
            codes, website structure, logos, content answers, and so forth.
            “Submissions” means any Content you post, upload, share, store, or
            otherwise provide through the Services
          </p>
        </article>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
