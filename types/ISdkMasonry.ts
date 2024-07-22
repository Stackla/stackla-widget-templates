import type { Sdk } from "@stackla/ugc-widgets";
import Masonry from "masonry-layout";

export interface ISdkMasonry extends Sdk {
  masonry: Masonry;
}
