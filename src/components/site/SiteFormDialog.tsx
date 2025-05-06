import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

// Import the utility functions and types
import {
  fetchSiteStatus,
  fetchPhase,
  fetchRegion,
  fetchDistrict,
  fetchParliament,
  fetchMukim,
  fetchState,
  fetchDun,
  fetchTechnology,
  fetchBandwidth,
  fetchBuildingType,
  fetchZone,
  fetchCategoryArea,
  fetchBuildingLevel,
  fetchSocioecomic,
  fetchSiteSpace,
  fetchOrganization,
  fetchAllStates,
  fetchAllDistricts,
  // Use the correct function names as they are exported
  fetchMukim as fetchAllMukims,
  fetchParliament as fetchAllParliaments,
  fetchDun as fetchAllDuns,
  type Site,
} from "./hook/site-utils";
import {
  DialogDescription,
} from "@radix-ui/react-dialog";
import { Textarea } from "../ui/textarea";
import { useUserMetadata } from "@/hooks/use-user-metadata";
import { useOrganizations } from "@/hooks/use-organizations";

interface SiteFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  site?: Site | null;
}

export const SiteFormDialog = ({ open, onOpenChange, site }: SiteFormDialogProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userMetadata = useUserMetadata();
  const parsedMetadata = userMetadata ? JSON.parse(userMetadata) : null;
  const isSuperAdmin = parsedMetadata?.user_type === "super_admin";
  const isTPUser =
    parsedMetadata?.user_group_name === "TP" &&
    !!parsedMetadata?.organization_id;
  const isDUSPUser =
    parsedMetadata?.user_group_name === "DUSP" &&
    !!parsedMetadata?.organization_id;
  const organizationId =
    parsedMetadata?.user_type !== "super_admin" &&
    (isTPUser || isDUSPUser) &&
    parsedMetadata?.organization_id
      ? parsedMetadata.organization_id
      : null;

  const { useOrganizationsByTypeQuery } = useOrganizations();

  const { data: dusps = [], isLoading: duspsIsLoading } =
    useOrganizationsByTypeQuery("dusp", isSuperAdmin);

  const [sitename, setSitename] = useState(site?.sitename || "");
  const [standardCode, setStandardCode] = useState(site?.nd_site?.[0]?.standard_code || "");
  const [phase, setPhase] = useState(site?.phase_id || "");
  const [region, setRegion] = useState(site?.region_id || "");
  const [activeStatus, setActiveStatus] = useState(site?.active_status === 1);
  const [email, setEmail] = useState(site?.email || "");
  const [website, setWebsite] = useState(site?.website || "");
  const [longitude, setLongitude] = useState(site?.longtitude || "");
  const [latitude, setLatitude] = useState(site?.latitude || "");
  const [operateDate, setOperateDate] = useState(site?.operate_date || "");
  const [technology, setTechnology] = useState(site?.technology || "");
  const [bandwidth, setBandwidth] = useState(site?.bandwidth || "");
  const [buildingType, setBuildingType] = useState(site?.building_type_id || "");
  const [buildingArea, setBuildingArea] = useState(site?.building_area_id || "");
  const [buildingRental, setBuildingRental] = useState(site?.building_rental_id || false);
  const [zone, setZone] = useState(site?.zone_id || "");
  const [area, setArea] = useState(site?.area_id || "");
  const [level, setLevel] = useState(site?.level_id || "");
  const [okuFriendly, setOkuFriendly] = useState(site?.oku_friendly || false);
  const [duspTp, setDuspTp] = useState(site?.dusp_tp_id || "");
  const [address1, setAddress1] = useState(site?.nd_site_address?.[0]?.address1 || "");
  const [address2, setAddress2] = useState(site?.nd_site_address?.[0]?.address2 || "");
  const [postcode, setPostcode] = useState(site?.nd_site_address?.[0]?.postcode || "");
  const [city, setCity] = useState(site?.nd_site_address?.[0]?.city || "");
  const [district, setDistrict] = useState(site?.nd_site_address?.[0]?.district_id || "");
  const [parliament, setParliament] = useState(site?.nd_parliament?.id || "");
  const [dun, setDun] = useState(site?.nd_dun?.id || "");
  const [mukim, setMukim] = useState(site?.nd_mukim?.id || "");
  const [state, setState] = useState(site?.nd_site_address?.[0]?.state_id || "");

  const [siteStatuses, setSiteStatuses] = useState([]);
  const [phases, setPhases] = useState([]);
  const [regions, setRegions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [parliaments, setParliaments] = useState([]);
  const [duns, setDuns] = useState([]);
  const [mukims, setMukims] = useState([]);
  const [states, setStates] = useState([]);
  const [technologies, setTechnologies] = useState([]);
  const [bandwidths, setBandwidths] = useState([]);
  const [buildingTypes, setBuildingTypes] = useState([]);
  const [zones, setZones] = useState([]);
  const [categoryAreas, setCategoryAreas] = useState([]);
  const [buildingLevels, setBuildingLevels] = useState([]);
  const [socioeconomics, setSocioeconomics] = useState([]);
  const [siteSpaces, setSiteSpaces] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [allStates, setAllStates] = useState([]);
  const [allDistricts, setAllDistricts] = useState([]);
  const [allMukims, setAllMukims] = useState([]);
  const [allParliaments, setAllParliaments] = useState([]);
  const [allDuns, setAllDuns] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statuses = await fetchSiteStatus();
        setSiteStatuses(statuses);

        const phasesData = await fetchPhase();
        setPhases(phasesData);

        const regionsData = await fetchRegion();
        setRegions(regionsData);

        const technologiesData = await fetchTechnology();
        setTechnologies(technologiesData);

        const bandwidthsData = await fetchBandwidth();
        setBandwidths(bandwidthsData);

        const buildingTypesData = await fetchBuildingType();
        setBuildingTypes(buildingTypesData);

        const zonesData = await fetchZone();
        setZones(zonesData);

        const categoryAreasData = await fetchCategoryArea();
        setCategoryAreas(categoryAreasData);

        const buildingLevelsData = await fetchBuildingLevel();
        setBuildingLevels(buildingLevelsData);

        const socioeconomicsData = await fetchSocioecomic();
        setSocioeconomics(socioeconomicsData);

        const siteSpacesData = await fetchSiteSpace();
        setSiteSpaces(siteSpacesData);

        const organizationsData = await fetchOrganization();
        setOrganizations(organizationsData);

        const allStatesData = await fetchAllStates();
        setAllStates(allStatesData);

        const allDistrictsData = await fetchAllDistricts();
        setAllDistricts(allDistrictsData);

        const allMukimsData = await fetchAllMukims(district);
        setAllMukims(allMukimsData);

        const allParliamentsData = await fetchAllParliaments(state);
        setAllParliaments(allParliamentsData);

        const allDunsData = await fetchAllDuns(parliament);
        setAllDuns(allDunsData);

        if (state) {
          const districtsData = await fetchDistrict(state);
          setDistricts(districtsData);
        }

        if (state) {
          const parliamentsData = await fetchParliament(state);
          setParliaments(parliamentsData);
        }

        if (district) {
          const mukimsData = await fetchMukim(district);
          setMukims(mukimsData);
        }

        if (parliament) {
          const dunsData = await fetchDun(parliament);
          setDuns(dunsData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load data. Please try again.",
          variant: "destructive",
        });
      }
    };

    fetchData();
  }, [district, parliament, state]);

  const handleStateChange = async (stateId: string) => {
    setState(stateId);
    setDistrict("");
    setParliament("");
    setDun("");
    setMukim("");
    try {
      const districtsData = await fetchDistrict(stateId);
      setDistricts(districtsData);

      const parliamentsData = await fetchParliament(stateId);
      setParliaments(parliamentsData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to load data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDistrictChange = async (districtId: string) => {
    setDistrict(districtId);
    setMukim("");
    try {
      const mukimsData = await fetchMukim(districtId);
      setMukims(mukimsData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to load data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleParliamentChange = async (parliamentId: string) => {
    setParliament(parliamentId);
    setDun("");
    try {
      const dunsData = await fetchDun(parliamentId);
      setDuns(dunsData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to load data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const updates = {
        sitename,
        phase_id: phase,
        region_id: region,
        active_status: activeStatus ? 1 : 0,
        email,
        website,
        longtitude: longitude,
        latitude: latitude,
        operate_date: operateDate,
        technology,
        bandwidth,
        building_type_id: buildingType,
        building_area_id: buildingArea,
        building_rental_id: buildingRental,
        zone_id: zone,
        area_id: area,
        level_id: level,
        oku_friendly: okuFriendly,
        dusp_tp_id: duspTp,
        nd_site_address: [
          {
            address1,
            address2,
            postcode,
            city,
            district_id: district,
            state_id: state,
          },
        ],
        nd_site: [
          {
            standard_code: standardCode,
          },
        ],
      };

      if (site) {
        // Update existing site
        const { error } = await supabase
          .from("nd_site_profile")
          .update(updates)
          .eq("id", site.id);

        if (error) {
          throw error;
        }

        toast({
          title: "Success",
          description: "Site updated successfully.",
        });
      } else {
        // Create new site
        const { data, error } = await supabase
          .from("nd_site_profile")
          .insert([updates])
          .select();

        if (error) {
          throw error;
        }

        toast({
          title: "Success",
          description: "Site created successfully.",
        });
      }

      queryClient.invalidateQueries({ queryKey: ["sites"] });
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating site:", error);
      toast({
        title: "Error",
        description: "Failed to save site. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fixed section for mukims.map
const renderMukimsSelect = (mukims: any) => {
  if (!mukims) return null;
  const mukimsArray = Array.isArray(mukims) ? mukims : [];
  
  return (
    <Select name="mukim_id" value={mukim} onValueChange={setMukim}>
      <SelectTrigger>
        <SelectValue placeholder="Select Mukim" />
      </SelectTrigger>
      <SelectContent>
        {mukimsArray.map((mukim: any) => (
          <SelectItem key={mukim.id} value={mukim.id.toString()}>
            {mukim.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

// Fixed section for parliaments.map
const renderParliamentsSelect = (parliaments: any) => {
  if (!parliaments) return null;
  const parliamentsArray = Array.isArray(parliaments) ? parliaments : [];
  
  return (
    <Select name="parliament_id" value={parliament} onValueChange={setParliament}>
      <SelectTrigger>
        <SelectValue placeholder="Select Parliament" />
      </SelectTrigger>
      <SelectContent>
        {parliamentsArray.map((parl: any) => (
          <SelectItem key={parl.id} value={parl.id.toString()}>
            {parl.fullname}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

// Fixed section for duns.map
const renderDunsSelect = (duns: any) => {
  if (!duns) return null;
  const dunsArray = Array.isArray(duns) ? duns : [];
  
  return (
    <Select name="dun_id" value={dun} onValueChange={setDun}>
      <SelectTrigger>
        <SelectValue placeholder="Select DUN" />
      </SelectTrigger>
      <SelectContent>
        {dunsArray.map((dun: any) => (
          <SelectItem key={dun.id} value={dun.id.toString()}>
            {dun.full_name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{site ? "Edit Site" : "Create New Site"}</DialogTitle>
          <DialogDescription>
            {site ? "Update site details" : "Enter details for the new site"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sitename">Site Name</Label>
            <Input
              id="sitename"
              value={sitename}
              onChange={(e) => setSitename(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="standard-code">Standard Code</Label>
            <Input
              id="standard-code"
              value={standardCode}
              onChange={(e) => setStandardCode(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phase">Phase</Label>
            <Select value={phase} onValueChange={setPhase}>
              <SelectTrigger>
                <SelectValue placeholder="Select Phase" />
              </SelectTrigger>
              <SelectContent>
                {phases.map((phase) => (
                  <SelectItem key={phase.id} value={phase.id}>
                    {phase.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="region">Region</Label>
            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger>
                <SelectValue placeholder="Select Region" />
              </SelectTrigger>
              <SelectContent>
                {regions.map((region) => (
                  <SelectItem key={region.id} value={region.id}>
                    {region.eng}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Select value={state} onValueChange={handleStateChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select State" />
              </SelectTrigger>
              <SelectContent>
                {allStates.map((state) => (
                  <SelectItem key={state.id} value={state.id}>
                    {state.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="district">District</Label>
            <Select value={district} onValueChange={handleDistrictChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select District" />
              </SelectTrigger>
              <SelectContent>
                {districts.map((district) => (
                  <SelectItem key={district.id} value={district.id}>
                    {district.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="parliament">Parliament</Label>
            {renderParliamentsSelect(parliaments)}
          </div>
          <div className="space-y-2">
            <Label htmlFor="dun">Dun</Label>
            {renderDunsSelect(duns)}
          </div>
          <div className="space-y-2">
            <Label htmlFor="mukim">Mukim</Label>
            {renderMukimsSelect(mukims)}
          </div>
          <div className="space-y-2">
            <Label htmlFor="address1">Address 1</Label>
            <Input
              id="address1"
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address2">Address 2</Label>
            <Input
              id="address2"
              value={address2}
              onChange={(e) => setAddress2(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="postcode">Postcode</Label>
            <Input
              id="postcode"
              value={postcode}
              onChange={(e) => setPostcode(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="longitude">Longitude</Label>
            <Input
              id="longitude"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="latitude">Latitude</Label>
            <Input
              id="latitude"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="operate-date">Operate Date</Label>
            <Input
              id="operate-date"
              type="date"
              value={operateDate}
              onChange={(e) => setOperateDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="technology">Technology</Label>
            <Select value={technology} onValueChange={setTechnology}>
              <SelectTrigger>
                <SelectValue placeholder="Select Technology" />
              </SelectTrigger>
              <SelectContent>
                {technologies.map((tech) => (
                  <SelectItem key={tech.id} value={tech.id}>
                    {tech.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bandwidth">Bandwidth</Label>
            <Select value={bandwidth} onValueChange={setBandwidth}>
              <SelectTrigger>
                <SelectValue placeholder="Select Bandwidth" />
              </SelectTrigger>
              <SelectContent>
                {bandwidths.map((bw) => (
                  <SelectItem key={bw.id} value={bw.id}>
                    {bw.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="building-type">Building Type</Label>
            <Select value={buildingType} onValueChange={setBuildingType}>
              <SelectTrigger>
                <SelectValue placeholder="Select Building Type" />
              </SelectTrigger>
              <SelectContent>
                {buildingTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.eng}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="building-area">Building Area</Label>
            <Input
              id="building-area"
              value={buildingArea}
              onChange={(e) => setBuildingArea(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="building-rental">Building Rental</Label>
            <Input
              id="building-rental"
              type="checkbox"
              checked={buildingRental}
              onChange={(e) => setBuildingRental(e.target.checked)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="zone">Zone</Label>
            <Select value={zone} onValueChange={setZone}>
              <SelectTrigger>
                <SelectValue placeholder="Select Zone" />
              </SelectTrigger>
              <SelectContent>
                {zones.map((zone) => (
                  <SelectItem key={zone.id} value={zone.id}>
                    {zone.zone}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="area">Area</Label>
            <Select value={area} onValueChange={setArea}>
              <SelectTrigger>
                <SelectValue placeholder="Select Area" />
              </SelectTrigger>
              <SelectContent>
                {categoryAreas.map((area) => (
                  <SelectItem key={area.id} value={area.id}>
                    {area.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="level">Level</Label>
            <Select value={level} onValueChange={setLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Select Level" />
              </SelectTrigger>
              <SelectContent>
                {buildingLevels.map((level) => (
                  <SelectItem key={level.id} value={level.id}>
                    {level.eng}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="oku-friendly">OKU Friendly</Label>
            <Input
              id="oku-friendly"
              type="checkbox"
              checked={okuFriendly}
              onChange={(e) => setOkuFriendly(e.target.checked)}
            />
          </div>
           {isSuperAdmin && (
                <div className="space-y-2">
                  <Label htmlFor="type">DUSP</Label>
                  <Select
                    name="dusp"
                    required
                    value={duspTp}
                    onValueChange={setDuspTp}
                    disabled={dusps ? false : true}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select DUSP" />
                    </SelectTrigger>
                    <SelectContent>
                      {dusps.map((dusp, index) => (
                        <SelectItem key={index} value={dusp.id.toString()}>
                          {dusp.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
          <div className="space-y-2">
            <Label htmlFor="active-status">Active Status</Label>
            <Input
              id="active-status"
              type="checkbox"
              checked={activeStatus}
              onChange={(e) => setActiveStatus(e.target.checked)}
            />
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
