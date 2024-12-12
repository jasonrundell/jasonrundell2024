import Image from 'next/image'

export interface RichTextAssetProps {
  id: string
  assets: { sys: { id: string }; url: string; description?: string }[]
}

export default function RichTextAsset({ id, assets }: RichTextAssetProps) {
  const asset = assets?.find((asset) => asset.sys.id === id)

  if (asset?.url) {
    return <Image src={asset.url} fill alt={asset.description || ''} />
  }

  return null
}
