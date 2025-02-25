import ChevronDown from "@/svgs/chevron-down.svg";
import ChevronUp from "@/svgs/chevron-up.svg";
import DeliveryIcon from "@/svgs/delivery.svg";
import ProfilePage, { ExternalPage } from ".";
import { ReactNode, useEffect, useState } from "react";
import styles from "@/parts/profile/profile.module.scss";
import { Layout } from "@/components/layout/Layout";
import classNames from "classnames";
import { Tabs } from "@/components/tabs/Tabs";
import SearchIcon from "@/svgs/search.svg";
import InventoryIcon from "@/svgs/inventory.svg";
import PlanetIcon from "@/svgs/planet.svg";
import { Dropdown } from "@/components/dropdown/dropdown";
import { useWindowSize } from "@/hooks/windowSize";
import { formatPrice, handleErrorRequest, shortIt } from "@/utils/handler";
import Image from "next/image";
import { imageURI } from "@/utils/colordetector";
import { useSelector } from "react-redux";
import { StateInterface, store } from "mredux";
import { MainReducer } from "mredux/reducers/main.reducer";
import { Pagination } from "@/components/pagination";
import {
  PhysicalData,
  VirtualData,
  addShippingAddress,
  fetchInventory,
  fetchPhysicalItems,
  fetchShippingAddresses,
  fetchVirtualItems,
  sellItems,
} from "@/utils/api.service";
import toast from "react-hot-toast";
import { ModalsReducer } from "mredux/reducers/modals.reducer";
import CloseCircle from "@/svgs/circle-close.svg";
import ClockCircle from "@/svgs/clock.svg";
import CircleMark from "@/svgs/circlecheckmark.svg";
import { useFeatureIsOn } from "@growthbook/growthbook-react";
import LightWalletIcon from "@/svgs/wallet2.svg";
import GreyBitcoin from "@/svgs/bitcoin.svg";

const tabs = ["Inventory", "Delivery"];

const options = [
  { value: "chocolate", Label: "Popular" },
  { value: "strawberry", Label: "Limited" },
  { value: "vanilla", Label: "Hot" },
  { value: "vanilla", Label: "All" },
];

const optionsItem = [
  { value: "chocolate", Label: "S" },
  { value: "strawberry", Label: "L" },
  { value: "vanilla", Label: "XL" },
  { value: "vanilla", Label: "XXL" },
];

const dpages = ["Physical Deliveries", "Virtual Deliveries"];

const sorters = [
  ["Name", "Provider", "Price", "Track-number", "Status"],
  ["Name", "Provider", "Price", "Track-number", "Status"],
];

const statusObj = (status: PhysicalData["status"]) => {
  let obj = {
    color: "yellow",
    text: status.toLowerCase(),
    Icon: () => <ClockCircle />,
  };

  switch (status) {
    case "SHIPPED":
      obj = {
        color: "green",
        text: "Received",
        Icon: () => <CircleMark />,
      };
      break;
    case "CANCELLED":
      obj = {
        color: "red",
        text: "Cancelled",
        Icon: () => <CloseCircle />,
      };
      break;
  }

  return obj;
};

export const InventoryPage: ExternalPage = () => {
  const { width } = useWindowSize();

  const lootgg_withdraw_enabled = useFeatureIsOn("lootgg_withdraw_enabled");
  const lootgg_crypto_withdraw_enabled = useFeatureIsOn(
    "lootgg_crypto_withdraw_enabled"
  );

  const { inventory, user } = useSelector<StateInterface, MainReducer>(
    (state) => state.mainReducer
  );
  const [activeTab, setActiveTab] = useState<number>(0x0);
  const [delIndex, setDelIndex] = useState<number>(0x0);
  const [sortIndex, setSortIndex] = useState(0x0);
  const [inventoryCheckBoxes, setInCb] = useState<Record<string, boolean>>({});
  const [buttonSellLoading, setBsl] = useState<boolean>(false);
  const [selectAll, setSellectAll] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<{ tp: number; ci: number }>({
    tp: 0,
    ci: 0,
  });

  const [physicalDeliveries, setPhysicalDeliveries] = useState<
    PhysicalData[] | null
  >(null);

  const [virtualDeliveries, setVirtualDeliveries] = useState<
    VirtualData[] | null
  >(null);

  const [sorter, setSorter] = useState<
    (
      | string
      | {
          label: string;
          value: string;
          active: boolean;
        }
      | undefined
    )[][]
  >(sorters);

  const [quries, setQueries] = useState<Record<string, any>>(
    Object.assign(
      {},
      ...dpages.map((key) => ({
        [key.toLowerCase().replace(/\s/g, "_")]: {
          page: 0x0,
          size: 0x10,
          total: null,
        },
      }))
    )
  );

  const [categories, setCatgories] = useState<{
    index: number;
    cats: string[];
  }>({
    index: 0x0,
    cats: [
      "All",
      "Featured",
      "Clothing",
      "Electronics",
      "Watches",
      "Jewelry",
      "Gaming",
    ],
  });

  const updateMainState = (payload: Partial<MainReducer>) => {
    store.dispatch({
      type: "UPDATE_MAIN_STATE",
      payload,
    });
  };

  const updateModalsState = (payload: Partial<ModalsReducer>) => {
    store.dispatch({
      type: "UPDATE_MODALS_STATE",
      payload,
    });
  };

  const fetchUserInventory = async () => {
    try {
      if (user) {
        setLoading(true);
        const fetchToGetTotalItems = await fetchInventory(
          user.id,
          Object.assign(
            {},
            {
              size: "10",
              page: 0x0,
            }
            // categories.index !== 0x0 && {}
          )
        );

        // console.log({ fetchToGetTotalItems });

        const totalInventoryItems = fetchToGetTotalItems?.totalElements ?? "10";

        const allInventoryItems = await fetchInventory(user.id, {
          // size:
          //   String(totalInventoryItems) === "0" ? "10" : totalInventoryItems,
          size: 99999,
          page: 0x0,
        });

        // console.log({ allInventoryItems });

        // (allInventoryItems?.content ?? []).length &&
        //   setPage({ tp: allInventoryItems.totalPages, ci: page.ci });

        setLoading(false);

        updateMainState({
          inventory: allInventoryItems?.content ?? [],
          // (inventory ?? [])
          //   .filter((l) => !allInventoryItems?.content.map((p) => p.id).includes(l.id))
          //   ?.concat(allInventoryItems?.content ?? []),
        });
      }
    } catch (e) {
      // console.log(e);
    }
  };

  const fetchPhysicalDel = async () => {
    try {
      const lk = await fetchPhysicalItems({
        size: 0x10,
        page: 0x0,
      });

      let key = dpages[0x0].toLowerCase().replace(/\s/g, "_");

      quries[key].total !== lk.totalPages &&
        setQueries({
          ...quries,
          [key]: {
            ...quries.key,
            total: lk.totalPages,
          },
        });

      setPhysicalDeliveries(lk?.content ?? []);
    } catch (e) {
      // console.log(e);
    }
  };

  const fetchVirtualDeli = async () => {
    try {
      const lk = await fetchVirtualItems({
        size: 0x10,
        page: 0x0,
      });

      let key = dpages[0x1].toLowerCase().replace(/\s/g, "_");

      quries[key].total !== lk.totalPages &&
        setQueries({
          ...quries,
          [key]: {
            ...quries.key,
            total: lk.totalPages,
          },
        });

      setVirtualDeliveries(lk?.content ?? []);
    } catch (e) {
      // console.log(e);
    }
  };
  const handleSellItems = async (
    items?: string[] | null,
    isModal?: boolean,
    tab: number = 0x0
  ) => {
    try {
      const selectedItems =
        items && Array.isArray(items)
          ? items
          : Object.keys(inventoryCheckBoxes).filter(
              (key) => inventoryCheckBoxes[key]
            );

      if (!selectedItems.length) {
        throw new Error("No items selected");
      }

      if (isModal) {
        updateModalsState({
          sellItemModal: inventory?.filter((l) => selectedItems.includes(l.id)),
          sellItemModalTab: tab,
        });

        setSellectAll(false);
        return;
      }

      setBsl(true);

      const res: string[] = await sellItems(selectedItems);

      setBsl(false);

      if (res && Array.isArray(res) && res.length) {
        updateMainState({
          inventory: (inventory ?? []).filter((l) => !res.includes(l.id)),
        });
        // if (user) {

        //   updateMainState({
        //     user: {
        //       ...user,
        //       usdBalance: user?.usdBalance + selectedItems.reduce((a, b) => {
        //         const item = inventory?.find((l) => l.id === b);
        //         return item ? a + item.item.price : a;
        //       }, 0x0),
        //     },
        //   });
        // }

        toast.success(
          "Items sold successfully, if you still see your items in the inventory, Please retry on inventory page."
        );
      } else {
        toast.success(
          "Failed to sell your items, please try again in inventory page"
        );
      }
    } catch (e) {
      setBsl(false);
      // console.log(e);
      toast.error(handleErrorRequest(e));
    }
  };

  const handleSelectAll = () => {
    setSellectAll((m) => {
      const u = !m;

      !u && setInCb({});
      u &&
        inventory &&
        setInCb(
          Object.assign(
            {},
            ...inventory.map(
              (item, i) =>
                // page.ci * 0x14 <= i && i <= page.ci * 0x14 + 0x14
                // ?
                ({
                  [item.id]: !!item.item.isSellable,
                })
              // : {}
            )
          )
        );
      return u;
    });
  };

  useEffect(() => {
    user && fetchUserInventory();
    fetchPhysicalDel();
  }, [user]);
  // }, [page.ci, categories]);

  return (
    <>
      <div className={classNames(styles.wrapper, styles.inventory)}>
        <Tabs
          tabs={tabs}
          activeTab={tabs.find((_, i) => i === activeTab) ?? tabs[0x0]}
          setActiveTab={(l, i) => void 0x0}
          disabledIndexes={[1]}
        />

        {(activeTab === 0x0 && (
          <div className={styles.invcontent}>
            <div className={styles.divider}>
              <div
                className={styles.selector}
                onClick={() => handleSelectAll()}
              >
                <label className="checkbox">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onClick={() => handleSelectAll()}
                    onChange={() => void 0x0}
                  />
                  <span className="checkmark"></span>
                </label>
                <span className={styles.text}>Choose all</span>
              </div>

              <div className={styles.right}>
                <div className={styles.btns}>
                  <button
                    className={` ${styles.btnSell}`}
                    onClick={() =>
                      lootgg_withdraw_enabled
                        ? handleSellItems(null, true)
                        : toast.error("This feature is not available yet")
                    }
                    disabled={buttonSellLoading}
                  >
                    <LightWalletIcon />
                    <span className={styles.buttonText}>
                      {Object.keys(inventoryCheckBoxes).some(
                        (key) => inventoryCheckBoxes[key] === true
                      )
                        ? `Sell for $ ${formatPrice(
                            inventory?.reduce(
                              (a, b) =>
                                b.id in inventoryCheckBoxes &&
                                inventoryCheckBoxes[b.id]
                                  ? a + b.item.price
                                  : a,
                              0x0
                            ) ?? 0x0
                          )}`
                        : "Sell"}
                    </span>
                  </button>
                  <button
                    className={styles.btn}
                    onClick={() =>
                      lootgg_withdraw_enabled
                        ? handleSellItems(null, true, 0x1)
                        : toast.error("This feature is not available yet")
                    }
                    disabled={
                      buttonSellLoading || !lootgg_crypto_withdraw_enabled
                    }
                  >
                    <GreyBitcoin />
                    <span className={styles.buttonText}>Cash out</span>
                  </button>
                </div>

                {/* <button className={classNames("primarybutton", styles.btnGo)}>
                  <DeliveryIcon />
                  <span>Get now</span>
                </button> */}
              </div>
            </div>

            <br />
            {/* <div className={styles.headerpart}>
              <div className={styles.buttons}>
                {categories.cats.map((category, i) => (
                  <button
                    key={i}
                    className={classNames(
                      styles.category,
                      i === categories.index && styles.active
                    )}
                    onClick={() =>
                      setCatgories(({ cats }) => ({
                        index: i,
                        cats,
                      }))
                    }
                  >
                    {category}
                  </button>
                ))}
              </div>

              <div className={styles.rightsectionInv}>
                <div className={styles.inputform}>
                  <SearchIcon />
                  <input type="text" placeholder="Search for cases..." />
                </div>

                <div className={styles.sorter}>
                  {(width > 400 && <span>Sort by:</span>) || null}
                  <Dropdown
                    options={options}
                    classNameButton={styles.buttonsort}
                    classNameList={styles.sortlist}
                    onChange={(index) => setSortIndex(index)}
                    currentIndex={sortIndex}
                  >
                    <span>{options[sortIndex].Label}</span>
                    <ChevronDown />
                  </Dropdown>
                </div>
              </div>
            </div> */}

            <br />

            <div className={`${styles.container} ${styles.scrollWrapper}`}>
              {inventory &&
                inventory.map((item, i) => (
                  // page.ci * 0x14 <= i &&
                  // i <= page.ci * 0x14 + 0x14 &&
                  <div
                    className={classNames(
                      styles.item,
                      !item.item.isSellable && styles.disabled
                    )}
                    key={i}
                    onClick={() =>
                      item.item.isSellable &&
                      setInCb((p) =>
                        Object.assign({}, p, {
                          [item.id]: !p[item.id],
                        })
                      )
                    }
                  >
                    <div className={styles.dividerItem}>
                      {/* <Dropdown
                            options={optionsItem}
                            classNameButton={styles.buttonsort}
                            classNameList={styles.sortlist}
                            onChange={(index) => setSortIndex(index)}
                            currentIndex={sortIndex}
                          >
                            <span>{optionsItem[sortIndex].Label}</span>
                            <ChevronDown />
                          </Dropdown> */}
                      <div></div>
                      <label
                        className="checkbox"
                        aria-disabled={!item.item.isSellable}
                      >
                        <input
                          type="checkbox"
                          checked={
                            !!(
                              item.id in inventoryCheckBoxes &&
                              inventoryCheckBoxes[item.id]
                            )
                          }
                          onChange={() => {
                            inventory[i].item.isSellable
                              ? setInCb((p) =>
                                  Object.assign({}, p, {
                                    [item.id]: !p[item.id],
                                  })
                                )
                              : toast.error(
                                  shortIt(item.item.name, 30) +
                                    ", This item can not be sold."
                                );
                          }}
                        />
                        <span className="checkmark"></span>
                      </label>
                    </div>
                    <div className={styles.itemPreview}>
                      <div className={styles.itemImage}>
                        <img
                          src={
                            item.item.images.length
                              ? item.item.images[0]?.url ?? ""
                              : imageURI(item.item.id, "item")
                          }
                          alt=""
                        />
                      </div>
                    </div>
                    <h3>{shortIt(item.item.name, 30)}</h3>
                    {/* <p>Intel</p> */}
                    <h3>$ {formatPrice(item.item.price)}</h3>
                    {/* <div className={styles.btns}>
                          <button className={styles.btn} disabled>
                            Change
                          </button>
                          <button
                            className={styles.btn}
                            disabled={buttonSellLoading}
                            onClick={() =>
                              updateModalsState({ sellItemModal: [item] })
                            }
                          >
                            Sell
                          </button>
                        </div>
                        <button
                          className={classNames("primarybutton", styles.btnGo)}
                        >
                          <DeliveryIcon />
                          <span>Get now</span>
                        </button> */}
                  </div>
                ))}
            </div>
            {(inventory !== null && !inventory.length && (
              <p>You don't have any items in your inventory at the moment.</p>
            )) ||
              null}
            <br />
            <br />
            {/* {(inventory && inventory.length && page.tp && (
              <Pagination
                page={page.ci}
                totalPages={page.tp}
                onChange={(index: number) => {
                  setPage((inputs) => ({
                    ...inputs,
                    ci: index,
                  }));
                }}
              />
            )) ||
              null} */}
          </div>
        )) ||
          null}

        {(activeTab === 0x1 && (
          <div className={styles.delivery}>
            <div className={styles.divider}>
              <div className={styles.left}>
                <div className={styles.buttons}>
                  <button
                    key={0}
                    className={classNames(
                      styles.category,
                      0x0 === delIndex && styles.active
                    )}
                    onClick={() => setDelIndex(0x0)}
                  >
                    <InventoryIcon />
                    <span>Physical Deliveries</span>
                  </button>
                  <button
                    key={1}
                    className={classNames(
                      styles.category,
                      0x1 === delIndex && styles.active
                    )}
                    onClick={() => setDelIndex(0x1)}
                  >
                    <PlanetIcon />
                    <span>Virtual Deliveries</span>
                  </button>
                </div>
              </div>

              <div className={styles.right}>
                <div className={styles.inputform}>
                  <SearchIcon />
                  <input type="text" placeholder="Search for cases..." />
                </div>

                <div className={styles.sorter}>
                  {(width > 400 && <span>Sort by:</span>) || null}
                  <Dropdown
                    options={options}
                    classNameButton={styles.buttonsort}
                    classNameList={styles.sortlist}
                    onChange={(index) => setSortIndex(index)}
                    currentIndex={sortIndex}
                  >
                    <span>{options[sortIndex].Label}</span>
                    <ChevronDown />
                  </Dropdown>
                </div>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  {sorter?.[delIndex].map(
                    (item, i) =>
                      item && (
                        <th key={i}>
                          <span
                            className={classNames(
                              typeof item === "object" && styles.sorterc
                            )}
                            onClick={() => {
                              setSorter(
                                sorter.map((items, index) =>
                                  index === delIndex
                                    ? items.map((item, ii) =>
                                        typeof item === "object"
                                          ? {
                                              ...item,
                                              active: !!(
                                                !item.active && i === ii
                                              ),
                                            }
                                          : item
                                      )
                                    : items
                                )
                              );
                            }}
                          >
                            {typeof item === "object" ? item.label : item ?? ""}
                            {typeof item === "object" && (
                              <div className={styles.sorter}>
                                <ChevronUp
                                  className={classNames(
                                    item.active && styles.active
                                  )}
                                />
                                <ChevronDown
                                  className={classNames(
                                    !item.active && styles.active
                                  )}
                                />
                              </div>
                            )}
                          </span>
                        </th>
                      )
                  )}
                </tr>
              </thead>
              <tbody>
                {delIndex === 0x0 &&
                  physicalDeliveries &&
                  physicalDeliveries.map((item, i) => (
                    <tr key={i}>
                      <td>
                        <div className={styles.item}>
                          <Image
                            width={64}
                            height={64}
                            className={styles.itemImage}
                            src={
                              "https://media.discordapp.net/attachments/803320462267514940/1184812655391805530/image.png?ex=658d55c5&is=657ae0c5&hm=5752a853feb2eb726cb162ea96250cd813b315009b97648cf03b3b9e094174d4&=&format=webp&quality=lossless&width=281&height=281"
                            }
                            // src={imageURI(
                            //   item.itemsOrdered[0x0].userItem.id,
                            //   "item",
                            //   true
                            // )}
                            alt=""
                          />
                          <div className={styles.text}>
                            <h3>50g Gold CombiBar</h3>
                            <p>Electronic</p>
                          </div>
                        </div>
                      </td>
                      <td>{item.trackingInfo?.shippingProvider ?? "--"}</td>

                      <td>$ {formatPrice(item.itemsOrdered[0x0].price)}</td>
                      <td>
                        <div className={styles.tracker}>
                          <span>
                            {item.trackingInfo?.referenceNumber ?? "--"}
                          </span>
                          {(item.trackingInfo?.link && (
                            <a href={item.trackingInfo?.link ?? ""}>
                              {item.trackingInfo?.link ?? "--"}
                            </a>
                          )) ||
                            null}
                        </div>
                      </td>
                      <td>
                        <div
                          className={classNames(
                            styles.status,
                            styles[statusObj(item.status).color]
                          )}
                        >
                          {statusObj(item.status).Icon() ?? null}
                          <span>{statusObj(item.status).text}</span>
                        </div>
                      </td>
                    </tr>
                  ))}

                {delIndex === 0x1 &&
                  virtualDeliveries &&
                  virtualDeliveries.map((item, i) => (
                    <tr key={i}>
                      <td>
                        <div className={styles.item}>
                          <Image
                            width={64}
                            height={64}
                            className={styles.itemImage}
                            src={
                              "https://media.discordapp.net/attachments/803320462267514940/1184812655391805530/image.png?ex=658d55c5&is=657ae0c5&hm=5752a853feb2eb726cb162ea96250cd813b315009b97648cf03b3b9e094174d4&=&format=webp&quality=lossless&width=281&height=281"
                            }
                            // src={imageURI(
                            //   item.itemsOrdered[0x0].userItem.id,
                            //   "item",
                            //   true
                            // )}
                            alt=""
                          />
                          <div className={styles.text}>
                            <h3>50g Gold CombiBar</h3>
                            <p>Electronic</p>
                          </div>
                        </div>
                      </td>
                      <td>$ {formatPrice(item.itemsOrdered[0x0].price)}</td>
                      <td>
                        <div
                          className={classNames(
                            styles.status,
                            styles[statusObj(item.status).color]
                          )}
                        >
                          {statusObj(item.status).Icon() ?? null}
                          <span>{statusObj(item.status).text}</span>
                        </div>
                      </td>

                      <td>
                        <div
                          className={classNames(
                            styles.status,
                            styles[statusObj(item.status).color]
                          )}
                        >
                          {statusObj(item.status).Icon() ?? null}
                          <span>{statusObj(item.status).text}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            {(quries?.[dpages[delIndex].toLowerCase().replace(/\s/g, "_")]
              ?.total && (
              <Pagination
                page={
                  quries?.[dpages[delIndex].toLowerCase().replace(/\s/g, "_")]
                    ?.page ?? 0x0
                }
                totalPages={
                  quries?.[dpages[delIndex].toLowerCase().replace(/\s/g, "_")]
                    ?.total
                }
                onChange={(index: number) => {
                  const key = dpages[delIndex]
                    .toLowerCase()
                    .replace(/\s/g, "_");
                  setQueries({
                    ...quries,
                    [key]: {
                      ...(quries?.[key] ?? {}),
                      page: index,
                      size: 0x10,
                    },
                  });
                }}
              />
            )) ||
              null}
          </div>
        )) ||
          null}
      </div>
    </>
  );
};

InventoryPage.getLayout = function getLayout(page: React.ReactNode) {
  return (
    <Layout>
      <ProfilePage>{page}</ProfilePage>
    </Layout>
  );
};

export default InventoryPage;
