
export const getOrganizationLogo = (organization: string) => {
  const orgLower = organization.toLowerCase();
  if (orgLower.includes('vinnova')) {
    return {
      src: "/lovable-uploads/dd840f7c-7034-4bfe-b763-b84461166cb6.png",
      alt: "Vinnova",
      className: "w-20 h-6 object-contain"
    };
  } else if (orgLower.includes('energimyndigheten')) {
    return {
      src: "/lovable-uploads/f8a26579-c7af-42a6-a518-0af3d65385d6.png",
      alt: "Energimyndigheten",
      className: "w-20 h-6 object-contain"
    };
  } else if (orgLower.includes('vetenskapsrådet')) {
    return {
      src: "/lovable-uploads/65e93ced-f449-4ba6-bcb0-5556c3edeb8a.png",
      alt: "Vetenskapsrådet",
      className: "w-20 h-6 object-contain"
    };
  } else if (orgLower.includes('formas')) {
    return {
      src: "/lovable-uploads/24e99124-8ec2-4d23-945b-ead48b809491.png",
      alt: "Formas",
      className: "w-20 h-6 object-contain"
    };
  } else if (orgLower.includes('tillväxtverket')) {
    return {
      src: "/lovable-uploads/112d5f02-31e8-4cb1-a8d5-7b7b422b0fa2.png",
      alt: "Tillväxtverket",
      className: "w-20 h-6 object-contain"
    };
  }
  if (orgLower.includes('europeiska kommissionen') || orgLower.includes('eu')) {
    return {
      src: '/eu-flag.png',
      alt: 'Europeiska unionen',
      className: 'w-8 h-8 rounded-md object-contain shadow-sm',
    };
  }
  return {
    src: "/lovable-uploads/dd840f7c-7034-4bfe-b763-b84461166cb6.png",
    alt: organization,
    className: "w-20 h-6 object-contain"
  };
};
